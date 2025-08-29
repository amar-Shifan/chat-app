import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for friends
  const friends = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Hey! How are you doing?',
      time: '2:34 PM',
      unread: 2,
      avatar: '👩‍💼',
      online: true,
      messages: [
        { id: 1, text: 'Hey there!', sender: 'them', time: '2:30 PM' },
        { id: 2, text: 'Hi Sarah! How are you?', sender: 'me', time: '2:32 PM' },
        { id: 3, text: 'I\'m doing great! Working on some new projects', sender: 'them', time: '2:33 PM' },
        { id: 4, text: 'Hey! How are you doing?', sender: 'them', time: '2:34 PM' }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Can we meet tomorrow?',
      time: '1:45 PM',
      unread: 0,
      avatar: '👨‍💻',
      online: false,
      messages: [
        { id: 1, text: 'Hey Mike!', sender: 'me', time: '1:40 PM' },
        { id: 2, text: 'Hi! How\'s the project going?', sender: 'them', time: '1:42 PM' },
        { id: 3, text: 'Going well, almost done', sender: 'me', time: '1:43 PM' },
        { id: 4, text: 'Can we meet tomorrow?', sender: 'them', time: '1:45 PM' }
      ]
    },
    {
      id: 3,
      name: 'Emma Wilson',
      lastMessage: 'Thanks for your help! 🙏',
      time: '12:15 PM',
      unread: 0,
      avatar: '👩‍🎨',
      online: true,
      messages: [
        { id: 1, text: 'Could you help me with the design?', sender: 'them', time: '12:10 PM' },
        { id: 2, text: 'Sure! I\'ll send you some examples', sender: 'me', time: '12:12 PM' },
        { id: 3, text: 'Thanks for your help! 🙏', sender: 'them', time: '12:15 PM' }
      ]
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      lastMessage: 'See you at the meeting',
      time: '11:30 AM',
      unread: 1,
      avatar: '👨‍🔬',
      online: false,
      messages: [
        { id: 1, text: 'Don\'t forget about the meeting at 3 PM', sender: 'them', time: '11:25 AM' },
        { id: 2, text: 'Got it, I\'ll be there', sender: 'me', time: '11:28 PM' },
        { id: 3, text: 'See you at the meeting', sender: 'them', time: '11:30 AM' }
      ]
    },
    {
      id: 5,
      name: 'Lisa Park',
      lastMessage: 'The presentation looks amazing!',
      time: 'Yesterday',
      unread: 0,
      avatar: '👩‍🏫',
      online: true,
      messages: [
        { id: 1, text: 'I finished the presentation', sender: 'me', time: 'Yesterday 5:20 PM' },
        { id: 2, text: 'Can I take a look?', sender: 'them', time: 'Yesterday 5:22 PM' },
        { id: 3, text: 'The presentation looks amazing!', sender: 'them', time: 'Yesterday 5:45 PM' }
      ]
    }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openChat = (friend) => {
    setSelectedFriend(friend);
    setCurrentView('chat');
  };

  const sendMessage = () => {
    if (message.trim() && selectedFriend) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      selectedFriend.messages.push(newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Home Page Component
  const HomePage = () => (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-orange-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-orange-900">Chats</h1>
          <MoreVertical className="w-6 h-6 text-orange-700 cursor-pointer" />
        </div>
        
        {/* Search Bar */}
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

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => openChat(friend)}
            className="flex items-center px-6 py-4 hover:bg-orange-100 cursor-pointer border-b border-orange-150 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-xl">
                {friend.avatar}
              </div>
              {friend.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
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

  // Chat Page Component
  const ChatPage = () => (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Chat Header */}
      <div className="bg-orange-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="mr-4 p-2 hover:bg-orange-300 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-orange-800" />
            </button>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-lg">
                  {selectedFriend.avatar}
                </div>
                {selectedFriend.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-orange-900">{selectedFriend.name}</h2>
                <p className="text-sm text-orange-700">
                  {selectedFriend.online ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors">
              <Video className="w-5 h-5 text-orange-800" />
            </button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-orange-800" />
            </button>
            <button className="p-2 hover:bg-orange-300 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-orange-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedFriend.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-orange-500 text-white rounded-br-sm'
                  : 'bg-white text-orange-900 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-orange-100' : 'text-orange-500'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white px-4 py-3 border-t border-orange-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 bg-orange-50 rounded-full border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl">
      {currentView === 'home' ? <HomePage /> : <ChatPage />}
    </div>
  );
};

export default App;