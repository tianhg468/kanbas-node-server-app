import db from "../Database/index.js";
let { users } = db;
const saveToDb = () => {
    db.users = users;
};

export const createUser = (user) => {
    const newUser = { ...user, _id: String(Date.now()) };
    users = [...users, newUser];
    saveToDb();
    return newUser;
};

export const findAllUsers = () => users;

export const findUserById = (userId) => 
    users.find((user) => user._id === userId);

export const findUserByUsername = (username) => 
    users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) => 
    users.find((user) => user.username === username && user.password === password);

// Basic user update
export const updateUser = (userId, user) => {
    const searchId = String(userId);
    users = users.map((u) => String(u._id) === searchId ? { ...u, ...user, _id: searchId } : u);
    saveToDb();
    return findUserById(searchId);
};

// Profile-specific update
export const updateProfile = (userId, updates) => {
    const user = findUserById(userId);
    if (!user) return null;

    // Create updated user with profile changes
    const updatedUser = {
        ...user,
        ...updates,
        _id: userId, // Ensure ID cannot be changed
        password: updates.password || user.password // Keep old password if not provided
    };

    // Update the user in the database
    users = users.map((u) => (u._id === userId ? updatedUser : u));
    return updatedUser;
};

// Check if username is available for profile update
export const isUsernameAvailable = (username, excludeUserId) => {
    return !users.some(user => 
        user.username === username && user._id !== excludeUserId
    );
};

export const deleteUser = (userId) => 
    (users = users.filter((u) => u._id !== userId));

// Function to get user profile
export const getUserProfile = (userId) => {
    const user = findUserById(userId);
    if (!user) return null;
    
    // Return user data without sensitive information if needed
    return user;
};