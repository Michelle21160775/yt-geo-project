 // Use VITE_API_URL if provided, otherwise fallback to localhost:3001
 const API_BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:3001') + '/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Fetch all app feedback comments
 * @param {number} page - Page number for pagination (optional)
 * @param {number} limit - Items per page (optional)
 * @returns {Promise<Array|Object>} Array of comments or paginated response
 */
export const fetchAllComments = async (page = null, limit = null) => {
    try {
        let url = `${API_BASE_URL}/comments`;

        if (page && limit) {
            url += `?page=${page}&limit=${limit}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return page && limit ? { comments: [], pagination: {} } : [];
    }
};

/**
 * Get total app feedback comment count
 * @returns {Promise<number>} Comment count
 */
export const getCommentCount = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/count`);
        if (!response.ok) throw new Error('Failed to fetch comment count');
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching comment count:', error);
        return 0;
    }
};

/**
 * Add a new app feedback comment
 * @param {Object} commentData - Comment data (userName, comment)
 * @returns {Promise<Object>} Added comment object
 */
export const addComment = async (commentData) => {
    const token = getAuthToken();

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Include auth token if available (optional authentication)
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

/**
 * Update a comment (requires authentication)
 * @param {string} commentId - Comment ID
 * @param {string} commentText - Updated comment text
 * @returns {Promise<Object>} Updated comment object
 */
export const updateComment = async (commentId, commentText) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication required to update comment');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: commentText })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

/**
 * Delete a comment (requires authentication)
 * @param {string} commentId - Comment ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteComment = async (commentId) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication required to delete comment');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

/**
 * Get all comments by current user (requires authentication)
 * @returns {Promise<Array>} Array of user's comments
 */
export const getUserComments = async () => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication required to fetch user comments');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/comments/user/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user comments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user comments:', error);
        return [];
    }
};
