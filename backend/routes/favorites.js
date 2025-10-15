const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    getUserFavorites,
    addFavorite,
    removeFavorite,
    isVideoInFavorites,
    getFavoriteByVideoId,
    removeFavoriteByVideoId
} = require('../models/favoritesDB');

const router = express.Router();

// Get all user favorites
router.get('/', authenticate, async (req, res) => {
    try {
        const favorites = await getUserFavorites(req.userId);

        // Format response to match frontend expectations
        const formattedFavorites = favorites.map(fav => ({
            id: fav._id.toString(),
            videoId: fav.videoId,
            title: fav.title,
            thumbnail: fav.thumbnail,
            channel: fav.channel,
            channelThumbnail: fav.channelThumbnail,
            duration: fav.duration,
            views: fav.views,
            publishedTime: fav.publishedTime,
            description: fav.description,
            dateAdded: fav.dateAdded
        }));

        res.json(formattedFavorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});

// Add video to favorites
router.post('/', authenticate, async (req, res) => {
    try {
        const videoData = req.body;

        if (!videoData.videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        // Check if already exists
        const exists = await isVideoInFavorites(req.userId, videoData.videoId);
        if (exists) {
            return res.status(409).json({ error: 'Video already in favorites' });
        }

        const favorite = await addFavorite(req.userId, videoData);

        res.status(201).json({
            id: favorite._id.toString(),
            ...favorite
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Error adding to favorites' });
    }
});

// Remove favorite by ID
router.delete('/:favoriteId', authenticate, async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const removed = await removeFavorite(req.userId, favoriteId);

        if (!removed) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Error removing favorite' });
    }
});

// Check if video is in favorites
router.get('/check/:videoId', authenticate, async (req, res) => {
    try {
        const { videoId } = req.params;
        const isFavorite = await isVideoInFavorites(req.userId, videoId);
        res.json({ isFavorite });
    } catch (error) {
        console.error('Error checking favorite status:', error);
        res.status(500).json({ error: 'Error checking favorite status' });
    }
});

// Toggle favorite (add/remove)
router.post('/toggle', authenticate, async (req, res) => {
    try {
        const videoData = req.body;

        if (!videoData.videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        const existing = await getFavoriteByVideoId(req.userId, videoData.videoId);

        if (existing) {
            await removeFavoriteByVideoId(req.userId, videoData.videoId);
            res.json({ added: false, message: 'Removed from favorites' });
        } else {
            const favorite = await addFavorite(req.userId, videoData);
            res.status(201).json({
                added: true,
                favorite: {
                    id: favorite._id.toString(),
                    ...favorite
                }
            });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Error toggling favorite' });
    }
});

module.exports = router;
