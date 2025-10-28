// src/pages/HomePage.jsx
import React, { useState, useMemo } from 'react';
import { MoreVertical, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { friends as initialFriends } from '../data/friends';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = useMemo(
    () => initialFriends.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  return (
    <div className="flex flex-col h-screen bg-orange-50">
      <div className="bg-orange-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-orange-900">Chats</h1>
          <h1 className="text-2xl font-bold text-orange-900">Chats</h1>
          <MoreVertical className="w-6 h-6 text-orange-700 cursor-pointer" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-600" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => navigate(`/chat/${friend.id}`, { state: { friend } })}
            className="flex items-center px-6 py-4 hover:bg-orange-100 cursor-pointer border-b border-orange-150 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-xl">
                {friend.avatar}
              </div>
              {friend.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-orange-900">{friend.name}</h3>
                <span className="text-sm text-orange-600">{friend.time}</span>
              </div>
              <p className="text-orange-700 text-sm truncate mt-1">{friend.lastMessage}</p>
            </div>

            {friend.unread > 0 && (
              <div className="ml-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {friend.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
