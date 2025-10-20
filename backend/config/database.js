const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yt-geo-project';

let client = null;
let db = null;

const connect = async () => {
    if (db) {
        return db;
    }

    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB successfully');

        // Create indexes
        await createIndexes();

        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

const createIndexes = async () => {
    try {
        // Users collection indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ googleId: 1 }, { sparse: true });

        // Favorites collection indexes
        await db.collection('favorites').createIndex({ userId: 1 });
        await db.collection('favorites').createIndex({ userId: 1, videoId: 1 }, { unique: true });

        // History collection indexes
        await db.collection('history').createIndex({ userId: 1 });
        await db.collection('history').createIndex({ userId: 1, watchedAt: -1 });
        await db.collection('history').createIndex({ userId: 1, videoId: 1 });

        // Comments collection indexes (app-level feedback)
        await db.collection('comments').createIndex({ createdAt: -1 });
        await db.collection('comments').createIndex({ userId: 1 });
        await db.collection('comments').createIndex({ userId: 1, createdAt: -1 });

        console.log('Database indexes created');
    } catch (error) {
        console.error('Error creating indexes:', error);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return db;
};

const disconnect = async () => {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('Disconnected from MongoDB');
    }
};

module.exports = {
    connect,
    getDb,
    disconnect
};
