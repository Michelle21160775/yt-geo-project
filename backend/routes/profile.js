const express = require('express');
const { authenticate } = require('../middleware/auth');
const { updateUser, updateUserPassword } = require('../models/userDB');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get user profile
router.get('/', authenticate, async (req, res) => {
    try {
        const { password, ...userProfile } = req.user;
        res.json({
            id: req.user._id.toString(),
            email: userProfile.email,
            name: userProfile.name,
            phone: userProfile.phone,
            bio: userProfile.bio,
            location: userProfile.location,
            profileImage: userProfile.profileImage
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Update user profile
router.put('/', authenticate, async (req, res) => {
    try {
        const { name, phone, bio, location, profileImage } = req.body;

        const updatedUser = await updateUser(req.userId, {
            name,
            phone,
            bio,
            location,
            profileImage
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userProfile } = updatedUser;
        res.json({
            id: updatedUser._id.toString(),
            ...userProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Update password (no se requiere la contraseña actual)
router.put('/password', authenticate, async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        // Hash new password and update regardless of whether the user had a previous password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(req.userId, hashedPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
});

module.exports = router;
