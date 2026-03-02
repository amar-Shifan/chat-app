import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initChatSocket } from './sockets/chatSocket.js';

dotenv.config();

export const createServerApp = () => {
  const app = express();

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/messages', messageRoutes);

  // basic error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Server error' });
  });

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST'],
    },
  });

  initChatSocket(io);

  return { app, server, io };
};

export const startServer = async () => {
  await connectDB();

  const { server } = createServerApp();
  
  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

