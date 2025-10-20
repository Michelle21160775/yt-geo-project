const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'comments';

/**
 * Get all app feedback comments
 */
const getAllComments = async () => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
};

/**
 * Get app feedback comments with pagination
 */
const getCommentsWithPagination = async (page = 1, limit = 20) => {
    const db = getDb();
    const skip = (page - 1) * limit;

    const [comments, totalCount] = await Promise.all([
        db.collection(COLLECTION_NAME)
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
        db.collection(COLLECTION_NAME)
            .countDocuments({})
    ]);

    return {
        comments,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + comments.length < totalCount
    };
};

/**
 * Add a new app feedback comment
 */
const addComment = async (commentData) => {
    const db = getDb();

    const comment = {
        userName: commentData.userName || 'Anonymous',
        userEmail: commentData.userEmail || null,
        userId: commentData.userId || null,
        comment: commentData.comment,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(comment);
    return {
        id: result.insertedId.toString(),
        _id: result.insertedId,
        ...comment
    };
};

/**
 * Update a comment
 */
const updateComment = async (commentId, userId, newCommentText) => {
    const db = getDb();
    const objectId = ObjectId.isValid(commentId) ? new ObjectId(commentId) : null;
    if (!objectId) return null;

    const query = { _id: objectId };

    // If userId is provided, ensure user owns the comment
    if (userId) {
        query.userId = userId;
    }

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
        query,
        {
            $set: {
                comment: newCommentText,
                updatedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );

    return result;
};

/**
 * Delete a comment
 */
const deleteComment = async (commentId, userId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(commentId) ? new ObjectId(commentId) : null;
    if (!objectId) return false;

    const query = { _id: objectId };

    // If userId is provided, ensure user owns the comment
    if (userId) {
        query.userId = userId;
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne(query);
    return result.deletedCount > 0;
};

/**
 * Get total app feedback comment count
 */
const getCommentCount = async () => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).countDocuments({});
};

/**
 * Get user's comments
 */
const getUserComments = async (userId) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME)
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
};

module.exports = {
    getAllComments,
    getCommentsWithPagination,
    addComment,
    updateComment,
    deleteComment,
    getCommentCount,
    getUserComments
};
