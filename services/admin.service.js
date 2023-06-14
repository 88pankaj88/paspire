const uuid = require("uuid");

const AdminDao = require("../dao/admin.dao");
const logger = require("../utils/logger");

const authenticate = async function (username, password) {
  try {
    if(AdminDao.validateCreds(username, password)) {
      const token = uuid.v4();
      AdminDao.saveAuthToken(username, token);
      return { value: { success: true, token } }
    }
    return { value: { success: false, message: `Invalid credentials` } }
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const logout = async function (authToken) {
  try {
    AdminDao.flushAuthToken(authToken);
    return { value: { success: true } };
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const authDetails = async function(authToken) {
  try {
    return AdminDao.authDetails(authToken);
  } catch (e) {
    logger.logInfo(e);
    return null;
  }
}

module.exports = {
  authenticate,
  logout,
  authDetails
};