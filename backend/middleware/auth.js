const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;
