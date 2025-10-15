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

// Update password
router.put('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        // Verify current password
        if (req.user.password) {
            const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
        } else {
            return res.status(400).json({ error: 'Cannot change password for OAuth users' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(req.userId, hashedPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
});

module.exports = router;
