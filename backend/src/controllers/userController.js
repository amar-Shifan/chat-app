import User from '../models/User.js';

export const getMe = async (req, res) => {
  return res.json(req.user);
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

