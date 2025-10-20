const express = require('express');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const {
    getAllComments,
    getCommentsWithPagination,
    addComment,
    updateComment,
    deleteComment,
    getCommentCount,
    getUserComments
} = require('../models/commentsDB');

const router = express.Router();

/**
 * Get all app feedback comments with optional pagination
 * GET /api/comments?page=1&limit=20
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // If pagination params provided, use pagination
        if (req.query.page || req.query.limit) {
            const result = await getCommentsWithPagination(page, limit);

            // Format comments for frontend
            const formattedComments = result.comments.map(comment => ({
                id: comment._id.toString(),
                userName: comment.userName,
                userEmail: comment.userEmail,
                userId: comment.userId,
                comment: comment.comment,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }));

            res.json({
                comments: formattedComments,
                pagination: {
                    totalCount: result.totalCount,
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                    hasMore: result.hasMore
                }
            });
        } else {
            // Get all comments without pagination
            const comments = await getAllComments();

            const formattedComments = comments.map(comment => ({
                id: comment._id.toString(),
                userName: comment.userName,
                userEmail: comment.userEmail,
                userId: comment.userId,
                comment: comment.comment,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }));

            res.json(formattedComments);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

/**
 * Get total app feedback comment count
 * GET /api/comments/count
 */
router.get('/count', async (req, res) => {
    try {
        const count = await getCommentCount();
        res.json({ count });
    } catch (error) {
        console.error('Error getting comment count:', error);
        res.status(500).json({ error: 'Error getting comment count' });
    }
});

/**
 * Add a new app feedback comment (optional authentication for logged-in users)
 * POST /api/comments
 */
router.post('/', optionalAuthenticate, async (req, res) => {
    try {
        const { userName, comment } = req.body;

        // Validation
        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        if (!userName || userName.trim() === '') {
            return res.status(400).json({ error: 'User name is required' });
        }

        if (comment.trim().length < 1) {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        if (comment.length > 1000) {
            return res.status(400).json({ error: 'Comment is too long (max 1000 characters)' });
        }

        // Prepare comment data
        const commentData = {
            userName: userName.trim(),
            comment: comment.trim(),
            userId: req.userId || null,
            userEmail: req.userEmail || null
        };

        const newComment = await addComment(commentData);

        res.status(201).json({
            id: newComment.id,
            userName: newComment.userName,
            userEmail: newComment.userEmail,
            userId: newComment.userId,
            comment: newComment.comment,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error adding comment' });
    }
});

/**
 * Update a comment (requires authentication)
 * PUT /api/comments/:commentId
 */
router.put('/:commentId', authenticate, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        if (comment.length > 1000) {
            return res.status(400).json({ error: 'Comment is too long (max 1000 characters)' });
        }

        const updatedComment = await updateComment(commentId, req.userId, comment.trim());

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found or unauthorized' });
        }

        res.json({
            id: updatedComment._id.toString(),
            userName: updatedComment.userName,
            comment: updatedComment.comment,
            createdAt: updatedComment.createdAt,
            updatedAt: updatedComment.updatedAt
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Error updating comment' });
    }
});

/**
 * Delete a comment (requires authentication)
 * DELETE /api/comments/:commentId
 */
router.delete('/:commentId', authenticate, async (req, res) => {
    try {
        const { commentId } = req.params;
        const deleted = await deleteComment(commentId, req.userId);

        if (!deleted) {
            return res.status(404).json({ error: 'Comment not found or unauthorized' });
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

/**
 * Get all comments by a user (requires authentication)
 * GET /api/comments/user/me
 */
router.get('/user/me', authenticate, async (req, res) => {
    try {
        const comments = await getUserComments(req.userId);

        const formattedComments = comments.map(comment => ({
            id: comment._id.toString(),
            userName: comment.userName,
            comment: comment.comment,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }));

        res.json(formattedComments);
    } catch (error) {
        console.error('Error fetching user comments:', error);
        res.status(500).json({ error: 'Error fetching user comments' });
    }
});

module.exports = router;
