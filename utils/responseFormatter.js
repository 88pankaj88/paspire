const logger = require('./logger')

module.exports = function (result, req, res) {
    if (result.error) {
        if (result.error.type === 'info') {
            logger.logError(result.error)
            return res.status(400).json({ error: result.error.message })
        } else {
            logger.logError(result.error)
            return res.status(500).json({ error: result.error || 'Something went wrong. Please try again later.' })
        }
    } else {
        return res.status(200).json({ data: result.value })
    }
}