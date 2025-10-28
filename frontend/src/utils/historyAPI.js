// Utilities for managing watch history with MongoDB backend integration

const HISTORY_STORAGE_KEY = 'videoFinder_history';
const USE_LOCAL_STORAGE = false; // Using backend MongoDB API
const MAX_HISTORY_ITEMS = 100; // Limit history to prevent localStorage overflow
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Fetch user's watch history
 * @returns {Promise<Array>} Array of watched videos
 */
export const fetchUserHistory = async () => {
    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};

/**
 * Add a video to watch history
 * @param {string} userId - User ID
 * @param {Object} videoData - Video data to add
 * @returns {Promise<Object>} Added history item
 */
export const addToHistory = async (userId, videoData) => {
    const historyItem = {
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        channel: videoData.channel,
        channelThumbnail: videoData.channelThumbnail || 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        duration: videoData.duration || '0:00',
        views: videoData.views || '0 views',
        publishedTime: videoData.publishedTime || 'Unknown',
        description: videoData.description || '',
        watchProgress: videoData.watchProgress || 0 // percentage of video watched
    };

    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(historyItem)
        });
        if (!response.ok) throw new Error('Failed to add to history');
        return await response.json();
    } catch (error) {
        console.error('Error adding to history:', error);
        throw error;
    }
};

/**
 * Remove a video from history
 * @param {string} userId - User ID
 * @param {string} historyId - History ID to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromHistory = async (userId, historyId) => {
    if (USE_LOCAL_STORAGE) {
        try {
            const currentHistory = await fetchUserHistory(userId);
            const updatedHistory = currentHistory.filter(item => item.id !== historyId);
            localStorage.setItem(`${HISTORY_STORAGE_KEY}_${userId}`, JSON.stringify(updatedHistory));
            return true;
        } catch (error) {
            console.error('Error removing from history:', error);
            throw error;
        }
    }

    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/history/${historyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error removing from history:', error);
        throw error;
    }
};

/**
 * Clear all history for a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const clearAllHistory = async (userId) => {
    if (USE_LOCAL_STORAGE) {
        try {
            localStorage.removeItem(`${HISTORY_STORAGE_KEY}_${userId}`);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    }

    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error clearing history:', error);
        throw error;
    }
};

/**
 * Update watch progress for a video
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @param {number} progress - Watch progress (0-100)
 * @returns {Promise<boolean>} Success status
 */
export const updateWatchProgress = async (userId, videoId, progress) => {
    if (USE_LOCAL_STORAGE) {
        try {
            const currentHistory = await fetchUserHistory(userId);
            const updatedHistory = currentHistory.map(item =>
                item.videoId === videoId
                    ? { ...item, watchProgress: progress, watchedAt: new Date().toISOString() }
                    : item
            );
            localStorage.setItem(`${HISTORY_STORAGE_KEY}_${userId}`, JSON.stringify(updatedHistory));
            return true;
        } catch (error) {
            console.error('Error updating watch progress:', error);
            throw error;
        }
    }

    // Backend API call
    try {
        const response = await fetch(`${API_BASE_URL}/history/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ videoId, progress })
        });
        return response.ok;
    } catch (error) {
        console.error('Error updating watch progress:', error);
        throw error;
    }
};

// Export configuration for easy switching between mock and real API
export const historyConfig = {
    USE_LOCAL_STORAGE,
    HISTORY_STORAGE_KEY,
    MAX_HISTORY_ITEMS
};