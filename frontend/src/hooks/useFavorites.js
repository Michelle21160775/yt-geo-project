import { useState, useEffect } from 'react';
import { 
    fetchUserFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    isVideoInFavorites,
    toggleFavorite
} from '../utils/favoritesAPI';

export const useFavorites = (userId) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user favorites
    const loadFavorites = async () => {
        if (!userId) return;
        
        setLoading(true);
        setError(null);
        try {
            const userFavorites = await fetchUserFavorites(userId);
            setFavorites(userFavorites);
        } catch (err) {
            setError('Error loading favorites');
            console.error('Error loading favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add video to favorites
    const addFavorite = async (videoData) => {
        if (!userId) return;
        
        try {
            const newFavorite = await addToFavorites(userId, videoData);
            setFavorites(prev => [newFavorite, ...prev]);
            return newFavorite;
        } catch (err) {
            setError('Error adding to favorites');
            console.error('Error adding to favorites:', err);
            throw err;
        }
    };

    // Remove video from favorites
    const removeFavorite = async (favoriteId) => {
        if (!userId) return;
        
        try {
            await removeFromFavorites(userId, favoriteId);
            setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        } catch (err) {
            setError('Error removing from favorites');
            console.error('Error removing from favorites:', err);
            throw err;
        }
    };

    // Check if video is in favorites
    const checkIfFavorite = async (videoId) => {
        if (!userId) return false;
        
        try {
            return await isVideoInFavorites(userId, videoId);
        } catch (err) {
            console.error('Error checking favorite status:', err);
            return false;
        }
    };

    // Toggle favorite status
    const toggleVideoFavorite = async (videoData) => {
        if (!userId) return;
        
        try {
            const result = await toggleFavorite(userId, videoData);
            
            if (result.added) {
                setFavorites(prev => [result.favorite, ...prev]);
            } else {
                setFavorites(prev => prev.filter(fav => fav.videoId !== videoData.videoId));
            }
            
            return result;
        } catch (err) {
            setError('Error toggling favorite');
            console.error('Error toggling favorite:', err);
            throw err;
        }
    };

    // Get favorite count
    const favoriteCount = favorites.length;

    // Check if specific video is favorited (from current state)
    const isVideoFavorited = (videoId) => {
        return favorites.some(fav => fav.videoId === videoId);
    };

    // Load favorites on mount and when userId changes
    useEffect(() => {
        loadFavorites();
    }, [userId]);

    return {
        favorites,
        loading,
        error,
        favoriteCount,
        loadFavorites,
        addFavorite,
        removeFavorite,
        checkIfFavorite,
        toggleVideoFavorite,
        isVideoFavorited,
        clearError: () => setError(null)
    };
};