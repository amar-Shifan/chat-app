// src/pages/ChatPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
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
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors"><Video className="w-5 h-5 text-orange-800" /></button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors"><Phone className="w-5 h-5 text-orange-800" /></button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors"><MoreVertical className="w-5 h-5 text-orange-800" /></button>
          </div>
        </div>
      </div>

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
