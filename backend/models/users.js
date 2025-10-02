// Simple in-memory user store (replace with database in production)
const users = [];

const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

const findUserById = (id) => {
    return users.find(user => user.id === id);
};

const createUser = (userData) => {
    const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
};

module.exports = { findUserByEmail, findUserById, createUser };
