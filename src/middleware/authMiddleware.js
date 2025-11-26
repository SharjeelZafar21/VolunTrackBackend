import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export default async function authMiddleware (req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({message: 'Missing Token'});

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('-passwordHash');
        if (!user) return res.status(401).json({message: 'Invalid user'});
        req.user = user;
        next();
    }catch (err){
        res.status(401).json({message: 'invalid token'});
    }
};


