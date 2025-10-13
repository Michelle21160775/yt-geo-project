// Utilities for managing favorites
// This file contains mock functions that can be easily replaced with real API calls

const FAVORITES_STORAGE_KEY = 'videoFinder_favorites';
const USE_LOCAL_STORAGE = true; // Set to false when integrating with backend

// Mock API functions - Replace these with real API calls

/**
 * Fetch user's favorite videos
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite videos
 */
export const fetchUserFavorites = async (userId) => {
    if (USE_LOCAL_STORAGE) {
        // Mock implementation using localStorage
        try {
            const stored = localStorage.getItem(`${FAVORITES_STORAGE_KEY}_${userId}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error fetching favorites from localStorage:', error);
            return [];
        }
    }
    
    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/favorites`, {
    //         headers: {
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         }
    //     });
    //     if (!response.ok) throw new Error('Failed to fetch favorites');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error fetching favorites:', error);
    //     throw error;
    // }
};

/**
 * Add a video to favorites
 * @param {string} userId - User ID
 * @param {Object} videoData - Video data to add
 * @returns {Promise<Object>} Added favorite object
 */
export const addToFavorites = async (userId, videoData) => {
    const favoriteData = {
        id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        channel: videoData.channel,
        channelThumbnail: videoData.channelThumbnail || 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        duration: videoData.duration || '0:00',
        views: videoData.views || '0 views',
        publishedTime: videoData.publishedTime || 'Unknown',
        dateAdded: new Date().toISOString(),
        description: videoData.description || ''
    };

    if (USE_LOCAL_STORAGE) {
        // Mock implementation using localStorage
        try {
            const currentFavorites = await fetchUserFavorites(userId);
            
            // Check if already exists
            const exists = currentFavorites.some(fav => fav.videoId === videoData.videoId);
            if (exists) {
                throw new Error('Video already in favorites');
            }
            
            const updatedFavorites = [favoriteData, ...currentFavorites];
            localStorage.setItem(`${FAVORITES_STORAGE_KEY}_${userId}`, JSON.stringify(updatedFavorites));
            return favoriteData;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    }

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/favorites`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         },
    //         body: JSON.stringify(favoriteData)
    //     });
    //     if (!response.ok) throw new Error('Failed to add to favorites');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error adding to favorites:', error);
    //     throw error;
    // }
};

/**
 * Remove a video from favorites
 * @param {string} userId - User ID
 * @param {string} favoriteId - Favorite ID to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromFavorites = async (userId, favoriteId) => {
    if (USE_LOCAL_STORAGE) {
        // Mock implementation using localStorage
        try {
            const currentFavorites = await fetchUserFavorites(userId);
            const updatedFavorites = currentFavorites.filter(fav => fav.id !== favoriteId);
            localStorage.setItem(`${FAVORITES_STORAGE_KEY}_${userId}`, JSON.stringify(updatedFavorites));
            return true;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    }

    // TODO: Replace with real API call
    // try {
    //     const response = await fetch(`/api/users/${userId}/favorites/${favoriteId}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${getAuthToken()}`
    //         }
    //     });
    //     return response.ok;
    // } catch (error) {
    //     console.error('Error removing from favorites:', error);
    //     throw error;
    // }
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
        const existingFavorite = await getFavoriteByVideoId(userId, videoData.videoId);
        
        if (existingFavorite) {
            await removeFromFavorites(userId, existingFavorite.id);
            return { added: false, favorite: null };
        } else {
            const newFavorite = await addToFavorites(userId, videoData);
            return { added: true, favorite: newFavorite };
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
};

// Helper function to get auth token (implement based on your auth system)
// const getAuthToken = () => {
//     return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
// };

// Export configuration for easy switching between mock and real API
export const favoritesConfig = {
    USE_LOCAL_STORAGE,
    FAVORITES_STORAGE_KEY
};

// Mock data generator for development/testing
export const generateMockFavorites = (count = 5) => {
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
        }
    ];

    return mockVideos.slice(0, count).map((video, index) => ({
        id: `fav_mock_${index + 1}`,
        ...video,
        channelThumbnail: 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',
        dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
};