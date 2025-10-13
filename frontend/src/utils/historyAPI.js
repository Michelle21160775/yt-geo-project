// Utilities for managing watch history
// This file contains mock functions that can be easily replaced with real API calls

const HISTORY_STORAGE_KEY = 'videoFinder_history';
const USE_LOCAL_STORAGE = true; // Set to false when integrating with backend
const MAX_HISTORY_ITEMS = 100; // Limit history to prevent localStorage overflow

/**
 * Fetch user's watch history
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of watched videos
 */
export const fetchUserHistory = async (userId) => {
    if (USE_LOCAL_STORAGE) {
        try {
            const stored = localStorage.getItem(`${HISTORY_STORAGE_KEY}_${userId}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error fetching history from localStorage:', error);
            return [];
        }
    }
    
    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/history`, {
    //         headers: {
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         }
    //     });
    //     if (!response.ok) throw new Error('Failed to fetch history');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error fetching history:', error);
    //     throw error;
    // }
};

/**
 * Add a video to watch history
 * @param {string} userId - User ID
 * @param {Object} videoData - Video data to add
 * @returns {Promise<Object>} Added history item
 */
export const addToHistory = async (userId, videoData) => {
    const historyItem = {
        id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        channel: videoData.channel,
        channelThumbnail: videoData.channelThumbnail || 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        duration: videoData.duration || '0:00',
        views: videoData.views || '0 views',
        publishedTime: videoData.publishedTime || 'Unknown',
        watchedAt: new Date().toISOString(),
        description: videoData.description || '',
        watchProgress: videoData.watchProgress || 0 // percentage of video watched
    };

    if (USE_LOCAL_STORAGE) {
        try {
            let currentHistory = await fetchUserHistory(userId);
            
            // Remove existing entry for this video to avoid duplicates
            currentHistory = currentHistory.filter(item => item.videoId !== videoData.videoId);
            
            // Add new entry at the beginning
            currentHistory.unshift(historyItem);
            
            // Limit history size
            if (currentHistory.length > MAX_HISTORY_ITEMS) {
                currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
            }
            
            localStorage.setItem(`${HISTORY_STORAGE_KEY}_${userId}`, JSON.stringify(currentHistory));
            return historyItem;
        } catch (error) {
            console.error('Error adding to history:', error);
            throw error;
        }
    }

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/history`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         },
    //         body: JSON.stringify(historyItem)
    //     });
    //     if (!response.ok) throw new Error('Failed to add to history');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error adding to history:', error);
    //     throw error;
    // }
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

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/history/${historyId}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         }
    //     });
    //     return response.ok;
    // } catch (error) {
    //     console.error('Error removing from history:', error);
    //     throw error;
    // }
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

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/history`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         }
    //     });
    //     return response.ok;
    // } catch (error) {
    //     console.error('Error clearing history:', error);
    //     throw error;
    // }
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

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/history/${videoId}/progress`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         },
    //         body: JSON.stringify({ progress })
    //     });
    //     return response.ok;
    // } catch (error) {
    //     console.error('Error updating watch progress:', error);
    //     throw error;
    // }
};

// Export configuration for easy switching between mock and real API
export const historyConfig = {
    USE_LOCAL_STORAGE,
    HISTORY_STORAGE_KEY,
    MAX_HISTORY_ITEMS
};

// Mock data generator for development/testing
export const generateMockHistory = (count = 10) => {
    const mockVideos = [
        {
            videoId: 'dQw4w9WgXcQ',
            title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
            thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            channel: 'Rick Astley',
            duration: '3:33',
            views: '1.2B views',
            publishedTime: '15 years ago',
            description: 'The official video for "Never Gonna Give You Up" by Rick Astley...'
        },
        {
            videoId: 'L_jWHffIx5E',
            title: 'Smash Mouth - All Star (Official Music Video)',
            thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg',
            channel: 'Smash Mouth',
            duration: '3:20',
            views: '500M views',
            publishedTime: '12 years ago',
            description: 'Official music video for All Star by Smash Mouth...'
        },
        {
            videoId: 'ZZ5LpwO-An4',
            title: 'GANGNAM STYLE(강남스타일) PSY(싸이)',
            thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
            channel: 'officialpsy',
            duration: '4:12',
            views: '4.8B views',
            publishedTime: '11 years ago',
            description: 'PSY - GANGNAM STYLE (강남스타일) MV...'
        },
        {
            videoId: 'kJQP7kiw5Fk',
            title: 'Despacito ft. Daddy Yankee',
            thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
            channel: 'Luis Fonsi',
            duration: '4:41',
            views: '8.2B views',
            publishedTime: '6 years ago',
            description: 'Despacito" disponible ya en todas las plataformas...'
        },
        {
            videoId: 'fJ9rUzIMcZQ',
            title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
            thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
            channel: 'Queen Official',
            duration: '5:55',
            views: '1.8B views',
            publishedTime: '13 years ago',
            description: 'Taken from A Night At The Opera, 1975...'
        },
        {
            videoId: 'Zi_XLOBDo_Y',
            title: 'Billie Eilish - bad guy (Official Music Video)',
            thumbnail: 'https://i.ytimg.com/vi/DyDfgMOUjCI/maxresdefault.jpg',
            channel: 'Billie Eilish',
            duration: '3:14',
            views: '1.1B views',
            publishedTime: '4 years ago',
            description: 'Official music video for "bad guy" by Billie Eilish...'
        },
        {
            videoId: 'YQHsXMglC9A',
            title: 'Adele - Hello (Official Music Video)',
            thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/maxresdefault.jpg',
            channel: 'Adele',
            duration: '6:07',
            views: '3.2B views',
            publishedTime: '8 years ago',
            description: 'Official music video for "Hello" by Adele...'
        }
    ];

    return mockVideos.slice(0, count).map((video, index) => ({
        id: `hist_mock_${index + 1}`,
        ...video,
        channelThumbnail: 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        watchedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        watchProgress: Math.floor(Math.random() * 100)
    }));
};