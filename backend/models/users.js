// MongoDB user operations - delegates to userDB
const userDB = require('./userDB');

const findUserByEmail = async (email) => {
    return await userDB.findUserByEmail(email);
};

const findUserById = async (id) => {
    const user = await userDB.findUserById(id);
    if (user && user._id) {
        user.id = user._id.toString();
    }
    return user;
};

const createUser = async (userData) => {
    return await userDB.createUser(userData);
};

module.exports = { findUserByEmail, findUserById, createUser };
