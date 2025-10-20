const { verifyToken } = require('../utils/jwt');
const { findUserById } = require('../models/users');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const user = await findUserById(decoded.email);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.userId = user._id.toString();
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

/**
 * Optional authentication middleware
 * Allows the request to proceed whether or not a valid token is provided
 * If a valid token is present, it sets req.user, req.userId, and req.userEmail
 */
const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // If no auth header, continue without user data
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            req.userId = null;
            req.userEmail = null;
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        // If token is invalid, continue without user data
        if (!decoded) {
            req.user = null;
            req.userId = null;
            req.userEmail = null;
            return next();
        }

        const user = await findUserById(decoded.email);

        // If user found, set user data
        if (user) {
            req.user = user;
            req.userId = user._id.toString();
            req.userEmail = user.email;
        } else {
            req.user = null;
            req.userId = null;
            req.userEmail = null;
        }

        next();
    } catch (error) {
        console.error('Optional authentication error:', error);
        // Even if there's an error, allow the request to proceed
        req.user = null;
        req.userId = null;
        req.userEmail = null;
        next();
    }
};

module.exports = { authenticate, optionalAuthenticate };
