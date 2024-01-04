const jwt = require('jsonwebtoken');
const User = require('../Models/adminModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    // console.log(req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // console.log('token found');
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            req.user = await User.findById(decoded.id).select('-password');
            // console.log(req.user);
            next();
        } catch (error) {
            // console.error(error);
            res.status(401).json({message: 'Not authorized, token failed'});
            throw new Error('Not authorized, token failed');
        }
    } else {
        // console.log('token not found');
        res.status(401).json({message: 'Not authorized, no token'});
        throw new Error('Not authorized, no token');
    }
});


module.exports = {protect};