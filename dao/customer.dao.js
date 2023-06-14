
const Md5 = require('md5');
const CustomerData = require('../models/customer');
const AuthTokens = {};

const validateCreds = function (username, password) {
    try {
        if(CustomerData[username]) {
            const dbPassword = CustomerData[username].password;
            const encryptedInputPassword = Md5(password);
            if(encryptedInputPassword === dbPassword) return true;
        }
        return false;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
}
// Auth token can be stored in cache which is in-memory here
const saveAuthToken = function(username,token) {
    //Not using try-catch as its in-memory operation
    AuthTokens[token] = { username }
}
const flushAuthToken = function(token) {
    delete AuthTokens[token];
}

const authDetails = function(token) {
    return AuthTokens[token];
}

module.exports = {
    validateCreds,
    saveAuthToken,
    flushAuthToken,
    authDetails
}