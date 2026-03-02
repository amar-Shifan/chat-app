import express from 'express';
import { getMe, getUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', protect, getUsers);

export default router;

