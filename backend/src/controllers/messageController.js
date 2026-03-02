import Message from '../models/Message.js';

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

