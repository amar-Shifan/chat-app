import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';

const onlineUsersByUserId = new Map();
const userIdBySocketId = new Map();

const getOnlineUsersPayload = () => {
  return Array.from(onlineUsersByUserId.keys());
};

export const initChatSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Socket auth error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId.toString();
    console.log('User connected:', userId, 'socket:', socket.id);

    onlineUsersByUserId.set(userId, socket.id);
    userIdBySocketId.set(socket.id, userId);

    io.emit('onlineUsers', getOnlineUsersPayload());

    socket.on('privateMessage', async ({ receiverId, message }) => {
      try {
        if (!receiverId || !message?.trim()) return;

        const msgDoc = await Message.create({
          senderId: userId,
          receiverId,
          message: message.trim(),
        });

        const payload = {
          _id: msgDoc._id,
          senderId: msgDoc.senderId,
          receiverId: msgDoc.receiverId,
          message: msgDoc.message,
          createdAt: msgDoc.createdAt,
        };

        // emit to sender
        socket.emit('newMessage', payload);

        // emit to receiver if online
        const receiverSocketId = onlineUsersByUserId.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', payload);
        }
      } catch (error) {
        console.error('privateMessage error:', error.message);
      }
    });

    // Signaling: initiate a call
    socket.on('call-user', ({ callerId, receiverId }) => {
      const receiverSocketId = onlineUsersByUserId.get(receiverId?.toString());
      if (!receiverSocketId) return;

      // Forward to receiver (same event name, different direction)
      io.to(receiverSocketId).emit('call-user', { callerId, receiverId });
    });

    // Signaling: call accepted / rejected
    socket.on('call-accepted', ({ callerId, receiverId }) => {
      const callerSocketId = onlineUsersByUserId.get(callerId?.toString());
      if (!callerSocketId) return;

      io.to(callerSocketId).emit('call-accepted', { callerId, receiverId });
    });

    socket.on('call-rejected', ({ callerId, receiverId }) => {
      const callerSocketId = onlineUsersByUserId.get(callerId?.toString());
      if (!callerSocketId) return;

      io.to(callerSocketId).emit('call-rejected', { callerId, receiverId });
    });

    // Signaling: WebRTC SDP and ICE
    socket.on('offer', ({ from, to, sdp }) => {
      const targetSocketId = onlineUsersByUserId.get(to?.toString());
      if (!targetSocketId) return;

      io.to(targetSocketId).emit('offer', { from, to, sdp });
    });

    socket.on('answer', ({ from, to, sdp }) => {
      const targetSocketId = onlineUsersByUserId.get(to?.toString());
      if (!targetSocketId) return;

      io.to(targetSocketId).emit('answer', { from, to, sdp });
    });

    socket.on('ice-candidate', ({ from, to, candidate }) => {
      const targetSocketId = onlineUsersByUserId.get(to?.toString());
      if (!targetSocketId) return;

      io.to(targetSocketId).emit('ice-candidate', { from, to, candidate });
    });

    socket.on('end-call', ({ from, to }) => {
      const targetSocketId = onlineUsersByUserId.get(to?.toString());
      if (targetSocketId) {
        io.to(targetSocketId).emit('end-call', { from, to });
      }
      // No server-side state; clients handle cleanup.
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = userIdBySocketId.get(socket.id);
      if (disconnectedUserId) {
        onlineUsersByUserId.delete(disconnectedUserId);
        userIdBySocketId.delete(socket.id);
      }
      io.emit('onlineUsers', getOnlineUsersPayload());
      console.log('User disconnected:', disconnectedUserId || socket.id);
    });
  });
};

