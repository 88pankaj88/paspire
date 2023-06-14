
const md5 = require('md5');

const AdminData = require('../models/admin');
const AdminAuthTokens = {};

const validateCreds = function (username, password) {
    try {
        if(AdminData[username]) {
            const dbPassword = AdminData[username].password;
            const encryptedInputPassword = md5(password);
            if(encryptedInputPassword === dbPassword) return true;
        }
        return false;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
}
// Auth token can be stored in cache, but storing it in-memory here
const saveAuthToken = function(username,token) {
    //Not using try-catch as its in-memory operation
    AdminAuthTokens[token] = { username }
}
const flushAuthToken = function(token) {
    delete AdminAuthTokens[token];
}

const authDetails = function(token) {
    return AdminAuthTokens[token];
}

module.exports = {
    validateCreds,
    saveAuthToken,
    flushAuthToken,
    authDetails
}