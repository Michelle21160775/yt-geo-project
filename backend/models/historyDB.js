const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'history';

const getUserHistory = async (userId, limit = 50) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME)
        .find({ userId })
        .sort({ watchedAt: -1 })
        .limit(limit)
        .toArray();
};

const addToHistory = async (userId, videoData) => {
    const db = getDb();

    // Check if video already exists in history
    const existing = await db.collection(COLLECTION_NAME).findOne({
        userId,
        videoId: videoData.videoId
    });

    if (existing) {
        // Update the watched timestamp and progress
        const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
            { userId, videoId: videoData.videoId },
            {
                $set: {
                    watchedAt: new Date(),
                    watchProgress: videoData.watchProgress || 0
                }
            },
            { returnDocument: 'after' }
        );
        
        // Return the updated document properly
        const updatedDoc = result.value || result;
        return {
            _id: updatedDoc._id || existing._id,
            id: (updatedDoc._id || existing._id).toString(),
            ...updatedDoc
        };
    }

    // Create new history entry
    const historyEntry = {
        userId,
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        channel: videoData.channel,
        channelThumbnail: videoData.channelThumbnail || 'https://yt3.ggpht.com/a/default-user=s28-c-k-c0x00ffffff-no-rj',    
        duration: videoData.duration || '0:00',
        views: videoData.views || '0 views',
        publishedTime: videoData.publishedTime || 'Unknown',
        description: videoData.description || '',
        watchProgress: videoData.watchProgress || 0,
        watchedAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(historyEntry);
    return {
        _id: result.insertedId,
        id: result.insertedId.toString(),
        ...historyEntry
    };
};

const removeFromHistory = async (userId, historyId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(historyId) ? new ObjectId(historyId) : null;
    if (!objectId) return false;

    const result = await db.collection(COLLECTION_NAME).deleteOne({
        _id: objectId,
        userId
    });

    return result.deletedCount > 0;
};

const clearAllHistory = async (userId) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteMany({ userId });
    return result.deletedCount;
};

const updateWatchProgress = async (userId, videoId, progress) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
        { userId, videoId },
        {
            $set: {
                watchProgress: progress,
                watchedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );
    return result.value || result;
};

module.exports = {
    getUserHistory,
    addToHistory,
    removeFromHistory,
    clearAllHistory,
    updateWatchProgress
};
