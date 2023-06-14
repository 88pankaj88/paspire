const uuid = require("uuid");

const CustomerDao = require("../dao/customer.dao");
const logger = require("../utils/logger");

const authenticate = async function (username, password) {
  try {
    if(CustomerDao.validateCreds(username, password)) {
      const token = uuid.v4();
      CustomerDao.saveAuthToken(username, token);
      return { value: { success: true, token } }
    }
    return { value: { success: false } }
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const logout = async function (authToken) {
  try {
    CustomerDao.flushAuthToken(authToken);
    return { value: { success: true } };
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const authDetails = async function(authToken) {
  try {
    return CustomerDao.authDetails(authToken);
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