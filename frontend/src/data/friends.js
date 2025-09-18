// src/data/friends.js
export const friends = [
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
      { id: 3, text: "I'm doing great! Working on some new projects", sender: 'them', time: '2:33 PM' },
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
      { id: 2, text: "Hi! How's the project going?", sender: 'them', time: '1:42 PM' },
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
      { id: 2, text: "Sure! I'll send you some examples", sender: 'me', time: '12:12 PM' },
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
      { id: 1, text: "Don't forget about the meeting at 3 PM", sender: 'them', time: '11:25 AM' },
      { id: 2, text: "Got it, I'll be there", sender: 'me', time: '11:28 PM' },
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
