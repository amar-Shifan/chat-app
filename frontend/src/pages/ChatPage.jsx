// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { friends as initialFriends } from '../data/friends';

export default function ChatPage() {
  const { friendId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(location.state?.friend ? { ...location.state.friend } : null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!selectedFriend) {
      const f = initialFriends.find((x) => String(x.id) === String(friendId));
      if (f) setSelectedFriend({ ...f });
    }
  }, [friendId, selectedFriend]);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedFriend?.messages?.length]);

  const sendMessage = () => {
    if (!message.trim() || !selectedFriend) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSelectedFriend((prev) => ({ ...prev, messages: [...(prev.messages || []), newMessage] }));
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedFriend) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Friend not found.</p>
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
                <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-lg">{selectedFriend.avatar}</div>
                {selectedFriend.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-orange-900">{selectedFriend.name}</h2>
                <p className="text-sm text-orange-700">{selectedFriend.online ? 'Online' : 'Last seen recently'}</p>
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
        {selectedFriend.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white text-orange-900 rounded-bl-sm shadow-sm'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-orange-100' : 'text-orange-500'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
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
