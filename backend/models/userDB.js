const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'users';

const findUserByEmail = async (email) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ email });
};

const findUserById = async (id) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ email:id });
};

const findUserByGoogleId = async (googleId) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ googleId });
};

const createUser = async (userData) => {
    const db = getDb();
    const newUser = {
        email: userData.email,
        password: userData.password || null,
        googleId: userData.googleId || null,
        name: userData.name || null,
        phone: userData.phone || null,
        bio: userData.bio || null,
        location: userData.location || null,
        profileImage: userData.profileImage || null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newUser);
    return {
        id: result.insertedId.toString(),
        _id: result.insertedId,
        ...newUser
    };
};

const updateUser = async (userId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    if (!objectId) throw new Error('Invalid user ID');

    const allowedUpdates = {
        name: updateData.name,
        phone: updateData.phone,
        bio: updateData.bio,
        location: updateData.location,
        profileImage: updateData.profileImage,
        updatedAt: new Date()
    };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key =>
        allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
        { _id: objectId },
        { $set: allowedUpdates },
        { returnDocument: 'after' }
    );

    return result;
};

const updateUserPassword = async (userId, hashedPassword) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    if (!objectId) throw new Error('Invalid user ID');

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
        { _id: objectId },
        {
            $set: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );

    return result;
};

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByGoogleId,
    createUser,
    updateUser,
    updateUserPassword
};
