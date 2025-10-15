const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'favorites';

const getUserFavorites = async (userId) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME)
        .find({ userId })
        .sort({ dateAdded: -1 })
        .toArray();
};

const addFavorite = async (userId, videoData) => {
    const db = getDb();

    const favorite = {
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
        dateAdded: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(favorite);
    return {
        id: result.insertedId.toString(),
        _id: result.insertedId,
        ...favorite
    };
};

const removeFavorite = async (userId, favoriteId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(favoriteId) ? new ObjectId(favoriteId) : null;
    if (!objectId) return false;

    const result = await db.collection(COLLECTION_NAME).deleteOne({
        _id: objectId,
        userId
    });

    return result.deletedCount > 0;
};

const isVideoInFavorites = async (userId, videoId) => {
    const db = getDb();
    const favorite = await db.collection(COLLECTION_NAME).findOne({
        userId,
        videoId
    });
    return !!favorite;
};

const getFavoriteByVideoId = async (userId, videoId) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({
        userId,
        videoId
    });
};

const removeFavoriteByVideoId = async (userId, videoId) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({
        userId,
        videoId
    });
    return result.deletedCount > 0;
};

module.exports = {
    getUserFavorites,
    addFavorite,
    removeFavorite,
    isVideoInFavorites,
    getFavoriteByVideoId,
    removeFavoriteByVideoId
};
