import { API_URL } from "../main";

const FAVORITES_STORAGE_KEY = 'videoFinder_favorites';
const API_BASE_URL = `${API_URL}/api`;

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Fetch user's favorite videos
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite videos
 */
export const fetchUserFavorites = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch favorites');
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

/**
 * Add a video to favorites
 * @param {string} userId - User ID
 * @param {Object} videoData - Video data to add
 * @returns {Promise<Object>} Added favorite object
 */
export const addToFavorites = async (userId, videoData) => {
    const favoriteData = {
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        channel: videoData.channel,
        channelThumbnail: videoData.channelThumbnail || 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        duration: videoData.duration || '0:00',
        views: videoData.views || '0 views',
        publishedTime: videoData.publishedTime || 'Unknown',
        description: videoData.description || ''
    };

    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(favoriteData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add to favorites');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
};

/**
 * Remove a video from favorites
 * @param {string} userId - User ID
 * @param {string} favoriteId - Favorite ID to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromFavorites = async (userId, favoriteId) => {
    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};

/**
 * Check if a video is in favorites
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID to check
 * @returns {Promise<boolean>} Whether video is in favorites
 */
export const isVideoInFavorites = async (userId, videoId) => {
    try {
        const favorites = await fetchUserFavorites(userId);
        return favorites.some(fav => fav.videoId === videoId);
    } catch (error) {
        console.error('Error checking if video is in favorites:', error);
        return false;
    }
};

/**
 * Get favorite by video ID
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object|null>} Favorite object or null
 */
export const getFavoriteByVideoId = async (userId, videoId) => {
    try {
        const favorites = await fetchUserFavorites(userId);
        return favorites.find(fav => fav.videoId === videoId) || null;
    } catch (error) {
        console.error('Error getting favorite by video ID:', error);
        return null;
    }
};

/**
 * Toggle favorite status of a video
 * @param {string} userId - User ID
 * @param {Object} videoData - Video data
 * @returns {Promise<{added: boolean, favorite: Object|null}>} Result of toggle operation
 */
export const toggleFavorite = async (userId, videoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(videoData)
        });
        if (!response.ok) throw new Error('Failed to toggle favorite');
        return await response.json();
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
};

// Export configuration for easy switching between mock and real API
export const favoritesConfig = {
    FAVORITES_STORAGE_KEY
};