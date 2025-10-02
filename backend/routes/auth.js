const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');
const { findUserByEmail, createUser } = require('../models/users');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ email, password: hashedPassword });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
});

// Google OAuth callback
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        const userData = encodeURIComponent(JSON.stringify({ id: req.user.id, email: req.user.email }));
        res.redirect(`http://localhost:5173?token=${token}&user=${userData}`);
    }
);

module.exports = router;
