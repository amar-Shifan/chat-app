import express from 'express';
import { registerUser , loginUser } from '../controllers/authControllers.js' 

let router = express.Router();

router.post('/signup' , registerUser)
router.post('/login' , loginUser);
router.get('/data' , (req, res) => {
    res.status(200).json({message: 'Hai'})
    console.log('working')
})

export default router