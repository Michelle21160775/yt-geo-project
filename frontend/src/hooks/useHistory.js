import { useState, useEffect, useCallback } from 'react';
import { 
    fetchUserHistory, 
    addToHistory, 
    removeFromHistory, 
    clearAllHistory,
    updateWatchProgress
} from '../utils/historyAPI';

export const useHistory = (userId) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user history
    const loadHistory = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        setError(null);
        try {
            const userHistory = await fetchUserHistory(userId);
            setHistory(userHistory);
        } catch (err) {
            setError('Error loading history');
            console.error('Error loading history:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Add video to history
    const addVideoToHistory = async (videoData) => {
        if (!userId) return;
        
        try {
            const newHistoryItem = await addToHistory(userId, videoData);
            // Update local state - remove any existing entry and add new one at the beginning
            setHistory(prev => {
                const filtered = prev.filter(item => item.videoId !== videoData.videoId);
                return [newHistoryItem, ...filtered];
            });
            return newHistoryItem;
        } catch (err) {
            setError('Error adding to history');
            console.error('Error adding to history:', err);
            throw err;
        }
    };

    // Remove video from history
    const removeVideoFromHistory = async (historyId) => {
        if (!userId) return;
        
        try {
            await removeFromHistory(userId, historyId);
            setHistory(prev => prev.filter(item => item.id !== historyId));
        } catch (err) {
            setError('Error removing from history');
            console.error('Error removing from history:', err);
            throw err;
        }
    };

    // Clear all history
    const clearHistory = async () => {
        if (!userId) return;
        
        try {
            await clearAllHistory(userId);
            setHistory([]);
        } catch (err) {
            setError('Error clearing history');
            console.error('Error clearing history:', err);
            throw err;
        }
    };

    // Update watch progress
    const updateProgress = async (videoId, progress) => {
        if (!userId) return;
        
        try {
            await updateWatchProgress(userId, videoId, progress);
            setHistory(prev => prev.map(item => 
                item.videoId === videoId 
                    ? { ...item, watchProgress: progress, watchedAt: new Date().toISOString() }
                    : item
            ));
        } catch (err) {
            setError('Error updating progress');
            console.error('Error updating progress:', err);
            throw err;
        }
    };

    // Get history count
    const historyCount = history.length;

    // Check if video is in history
    const isVideoInHistory = (videoId) => {
        return history.some(item => item.videoId === videoId);
    };

    // Get watch progress for a video
    const getWatchProgress = (videoId) => {
        const item = history.find(item => item.videoId === videoId);
        return item?.watchProgress || 0;
    };

    // Load history on mount and when userId changes
    useEffect(() => {
        loadHistory();
    }, [userId, loadHistory]);

    return {
        history,
        loading,
        error,
        historyCount,
        loadHistory,
        addVideoToHistory,
        removeVideoFromHistory,
        clearHistory,
        updateProgress,
        isVideoInHistory,
        getWatchProgress,
        clearError: () => setError(null)
    };
};