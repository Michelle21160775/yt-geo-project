const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    getUserHistory,
    addToHistory,
    removeFromHistory,
    clearAllHistory,
    updateWatchProgress
} = require('../models/historyDB');

const router = express.Router();

// Get user history
router.get('/', authenticate, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const history = await getUserHistory(req.userId, limit);

        // Format response to match frontend expectations
        const formattedHistory = history.map(item => ({
            id: item._id.toString(),
            videoId: item.videoId,
            title: item.title,
            thumbnail: item.thumbnail,
            channel: item.channel,
            channelThumbnail: item.channelThumbnail,
            duration: item.duration,
            views: item.views,
            publishedTime: item.publishedTime,
            description: item.description,
            watchProgress: item.watchProgress,
            watchedAt: item.watchedAt
        }));

        res.json(formattedHistory);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Error fetching history' });
    }
});

// Add video to history
router.post('/', authenticate, async (req, res) => {
    try {
        const videoData = req.body;

        if (!videoData.videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        const historyEntry = await addToHistory(req.userId, videoData);

        res.status(201).json({
            id: historyEntry._id.toString(),
            ...historyEntry
        });
    } catch (error) {
        console.error('Error adding to history:', error);
        res.status(500).json({ error: 'Error adding to history' });
    }
});

// Remove history item
router.delete('/:historyId', authenticate, async (req, res) => {
    try {
        const { historyId } = req.params;
        const removed = await removeFromHistory(req.userId, historyId);

        if (!removed) {
            return res.status(404).json({ error: 'History item not found' });
        }

        res.json({ message: 'History item removed successfully' });
    } catch (error) {
        console.error('Error removing history item:', error);
        res.status(500).json({ error: 'Error removing history item' });
    }
});

// Clear all history
router.delete('/', authenticate, async (req, res) => {
    try {
        const count = await clearAllHistory(req.userId);
        res.json({ message: `Cleared ${count} history items` });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Error clearing history' });
    }
});

// Update watch progress
router.put('/progress', authenticate, async (req, res) => {
    try {
        const { videoId, progress } = req.body;

        if (!videoId || progress === undefined) {
            return res.status(400).json({ error: 'Video ID and progress are required' });
        }

        const updated = await updateWatchProgress(req.userId, videoId, progress);

        if (!updated) {
            return res.status(404).json({ error: 'Video not found in history' });
        }

        res.json({ message: 'Watch progress updated successfully' });
    } catch (error) {
        console.error('Error updating watch progress:', error);
        res.status(500).json({ error: 'Error updating watch progress' });
    }
});

module.exports = router;
