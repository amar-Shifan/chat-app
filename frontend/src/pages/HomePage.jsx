// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import { getSocket } from '../api/socket.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleOnlineUsers = (list) => {
      setOnlineUsers(list);
    };

    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, []);

  const filteredFriends = useMemo(
    () =>
      users.filter((f) => f.username.toLowerCase().includes(searchTerm.toLowerCase())),
    [users, searchTerm]
  );

  return (
    <div className="flex flex-col h-screen bg-orange-50">
      <div className="bg-orange-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-orange-900">Chats</h1>
          <div className="flex items-center space-x-3">
            {user && (
              <span className="text-sm text-orange-800">
                {user.username}
              </span>
            )}
            <button
              onClick={logout}
              className="text-sm text-orange-800 hover:text-orange-900 underline"
            >
              Logout
            </button>
            <MoreVertical className="w-6 h-6 text-orange-700 cursor-pointer" />
          </div>
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
        {loading && (
          <div className="p-6 text-center text-orange-700">Loading users...</div>
        )}
        {!loading && filteredFriends.length === 0 && (
          <div className="p-6 text-center text-orange-700">No users found.</div>
        )}
        {filteredFriends.map((friend) => (
          <div
            key={friend._id}
            onClick={() => navigate(`/chat/${friend._id}`, { state: { friend } })}
            className="flex items-center px-6 py-4 hover:bg-orange-100 cursor-pointer border-b border-orange-150 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-xl">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              {onlineUsers.includes(friend._id) && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-orange-900">{friend.username}</h3>
                <span className="text-sm text-orange-600">
                  {onlineUsers.includes(friend._id) ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-orange-700 text-sm truncate mt-1">
                {friend.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
