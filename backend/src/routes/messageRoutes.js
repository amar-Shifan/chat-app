import express from 'express';
import { getConversation } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getConversation);

export default router;

