const logger = require('./../config/logger').logger
const logError = function (err) {
    if (err.type === 'info') {
        logger.info(JSON.stringify(err.data ? err.data : err))
    } else {
        logger.error(JSON.stringify(err.data));
    }
    return;
}
const logInfo = function (info) {
    if (typeof info === 'string') {
        logger.info(info)
    } else {
        logger.info(JSON.stringify(info))
    }
    return;
}
module.exports = {
    logError,
    logInfo
}