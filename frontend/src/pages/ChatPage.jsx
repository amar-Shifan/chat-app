// src/pages/ChatPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, X } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import { getSocket } from '../api/socket.js';

export default function ChatPage() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(location.state?.friend || null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle | calling | ringing | in-call
  const [callError, setCallError] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        if (!selectedUser) {
          const { data } = await API.get('/users');
          const found = data.find((u) => String(u._id) === String(userId));
          if (found) {
            setSelectedUser(found);
          }
        }
        const { data: conversation } = await API.get(`/messages/${userId}`);
        setMessages(conversation);
      } catch (error) {
        console.error('Failed to load conversation', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMessages();
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        (String(msg.senderId) === String(userId) && String(msg.receiverId) === String(user._id)) ||
        (String(msg.receiverId) === String(userId) && String(msg.senderId) === String(user._id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [userId, user?._id]);

  // WebRTC helpers
  const createPeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        if (!socket) return;
        socket.emit('ice-candidate', {
          from: user._id,
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      remoteStreamRef.current.addTrack(event.track);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const flushPendingIceCandidates = async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !pc.remoteDescription) return;
    const pending = pendingIceCandidatesRef.current;
    pendingIceCandidatesRef.current = [];
    for (const c of pending) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch (err) {
        console.error('Error flushing ICE candidate:', err);
      }
    }
  };

  const setupLocalMedia = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    return stream;
  };

  const cleanupCall = () => {
    setIsCalling(false);
    setIncomingCall(null);
    setInCall(false);
    setCallStatus('idle');
    setCallError('');

    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((t) => t.stop());
      remoteStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncomingCall = ({ callerId, receiverId }) => {
      if (String(receiverId) !== String(user._id) || String(callerId) !== String(userId)) return;
      setIncomingCall({ callerId, receiverId });
      setCallStatus('ringing');
    };

    const handleCallAccepted = async ({ callerId, receiverId }) => {
      if (String(callerId) !== String(user._id) || String(receiverId) !== String(userId)) return;
      // We are the caller and the callee accepted – create offer
      try {
        await setupLocalMedia();
        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('offer', {
          from: user._id,
          to: userId,
          sdp: offer,
        });

        setInCall(true);
        setCallStatus('in-call');
      } catch (err) {
        console.error('Error creating offer:', err);
        cleanupCall();
      }
    };

    const handleCallRejected = ({ callerId, receiverId }) => {
      if (String(callerId) !== String(user._id) || String(receiverId) !== String(userId)) return;
      cleanupCall();
    };

    const handleOffer = async ({ from, to, sdp }) => {
      if (String(to) !== String(user._id) || String(from) !== String(userId)) return;
      try {
        // If the user already clicked Accept, local media may already be ready.
        await setupLocalMedia();
        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await flushPendingIceCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', {
          from: user._id,
          to: userId,
          sdp: answer,
        });

        setInCall(true);
        setCallStatus('in-call');
      } catch (err) {
        console.error('Error handling offer:', err);
        cleanupCall();
      }
    };

    const handleAnswer = async ({ from, to, sdp }) => {
      if (String(to) !== String(user._id) || String(from) !== String(userId)) return;
      const pc = peerConnectionRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await flushPendingIceCandidates();
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    };

    const handleIceCandidate = async ({ from, to, candidate }) => {
      if (String(to) !== String(user._id) || String(from) !== String(userId)) return;
      const pc = peerConnectionRef.current;
      if (!pc || !candidate) return;
      try {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          pendingIceCandidatesRef.current.push(candidate);
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    const handleEndCall = () => {
      cleanupCall();
    };

    socket.on('call-user', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('end-call', handleEndCall);

    return () => {
      socket.off('call-user', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('end-call', handleEndCall);
    };
  }, [userId, user?._id]);

  const startCall = async () => {
    const socket = getSocket();
    if (!socket || isCalling || inCall) return;
    try {
      // Must be triggered by the user gesture for best browser compatibility.
      setCallError('');
      setIsCalling(true);
      setCallStatus('calling');
      await setupLocalMedia();

      socket.emit('call-user', {
        callerId: user._id,
        receiverId: userId,
      });
    } catch (err) {
      console.error('Failed to start call (media permission?):', err);
      const msg =
        err?.name === 'NotAllowedError'
          ? 'Camera/mic permission denied. Please allow access and try again.'
          : err?.name === 'NotReadableError'
            ? 'Camera/mic is currently in use by another app/tab. Close it and try again.'
            : 'Could not access camera/mic. Please check permissions and devices.';
      setCallError(msg);
      cleanupCall();
    }
  };

  const acceptCall = async () => {
    const socket = getSocket();
    if (!socket || !incomingCall) return;
    try {
      // IMPORTANT: request media on the Accept click (user gesture),
      // not later in the offer handler, otherwise browsers may block it.
      setCallError('');
      setIsCalling(true);
      setCallStatus('connecting');
      await setupLocalMedia();

      setIncomingCall(null);
      socket.emit('call-accepted', {
        callerId: incomingCall.callerId,
        receiverId: incomingCall.receiverId,
      });
    } catch (err) {
      console.error('Failed to accept call (media permission?):', err);
      const msg =
        err?.name === 'NotAllowedError'
          ? 'Camera/mic permission denied. Please allow access and press Accept again.'
          : err?.name === 'NotReadableError'
            ? 'Camera/mic is currently in use by another app/tab. Close it and press Accept again.'
            : 'Could not access camera/mic. Please check permissions and devices.';
      setCallError(msg);
      // Do NOT auto-reject the call (that cancels the caller UI). Keep ringing so the user can retry.
      setIsCalling(false);
      setCallStatus('ringing');
    }
  };

  const rejectCall = () => {
    const socket = getSocket();
    if (!socket || !incomingCall) return;

    socket.emit('call-rejected', {
      callerId: incomingCall.callerId,
      receiverId: incomingCall.receiverId,
    });
    setIncomingCall(null);
    cleanupCall();
  };

  const endCall = () => {
    const socket = getSocket();
    if (socket && (isCalling || inCall)) {
      socket.emit('end-call', {
        from: user._id,
        to: userId,
      });
    }
    cleanupCall();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit('privateMessage', {
      receiverId: userId,
      message: message.trim(),
    });
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4">User not found.</p>
          <button onClick={() => navigate('/home')} className="px-4 py-2 bg-orange-500 text-white rounded">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-orange-50">
      <div className="bg-orange-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/home')} className="mr-4 p-2 hover:bg-orange-300 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-orange-800" />
            </button>

            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-lg">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-orange-900">{selectedUser.username}</h2>
                <p className="text-sm text-orange-700">{selectedUser.email}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              className="p-2 hover:bg-orange-300 rounded-full transition-colors"
              onClick={startCall}
              disabled={isCalling || inCall}
            >
              <Video className="w-5 h-5 text-orange-800" />
            </button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors"><Phone className="w-5 h-5 text-orange-800" /></button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors"><MoreVertical className="w-5 h-5 text-orange-800" /></button>
          </div>
        </div>
      </div>

      {/* Call overlay */}
      {(isCalling || inCall) && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-orange-900">
                {inCall ? 'In Call' : 'Calling...'}
              </h2>
              <button
                className="p-1 rounded-full hover:bg-orange-100"
                onClick={endCall}
              >
                <X className="w-4 h-4 text-orange-800" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-orange-700 mb-1">You</p>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-40 bg-black rounded-xl object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-orange-700 mb-1">{selectedUser.username}</p>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-40 bg-black rounded-xl object-cover"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={endCall}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming call popup */}
      {incomingCall && callStatus === 'ringing' && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-xl">
            <p className="text-orange-900 font-semibold mb-2">
              Incoming call from {selectedUser.username}
            </p>
            {callError && (
              <p className="text-sm text-red-600 mb-3">
                {callError}
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={rejectCall}
                className="px-3 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium"
              >
                Reject
              </button>
              <button
                onClick={acceptCall}
                className="px-3 py-2 rounded-full bg-green-500 text-white text-sm font-medium"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div className="text-center text-orange-700">Loading messages...</div>}
        {!loading &&
          messages.map((msg) => {
            const isMe = String(msg.senderId) === String(user._id);
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isMe ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white text-orange-900 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-orange-100' : 'text-orange-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      <div className="bg-white px-4 py-3 border-t border-orange-200">
        <div className="flex items-center space-x-3">
          <textarea
            rows={1}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 bg-orange-50 rounded-full border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
          />
          <button onClick={sendMessage} className="p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
