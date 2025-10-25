const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async function (req, res, next) {
    const header = req.header.authorization;
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