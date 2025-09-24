import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , { expiresIn: '30d' })
}
export const registerUser = async(req ,res) => {
    try {
        let { username , email , password } = req.body

        let userExists = await User.findOne({email});
        
        if(userExists){
            return res.status(400).json({ message : 'User already exists!'})
        }

        let user = await User.create({username, email, password});

        res.status(201).json({
            _id: user._id,
            username: username, 
            email: email,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export const loginUser = async(req ,res) => {
    try {
        let { email , password } = req.body

        let user = await User.findOne({email});

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}