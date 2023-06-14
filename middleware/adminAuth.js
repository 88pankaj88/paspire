let AdminService = require('./../services/admin.service')

module.exports = function (mandatoryAuth = true) {
    return async function (req, res, next) {
        try {
            if(!mandatoryAuth) return next();
            let token = req.headers.authorization;
            if(!token) return res.status(401).json({ message: 'Invalid or Missing Token' });

            const authDetails = await AdminService.authDetails(token);
            if(!authDetails) return res.status(401).json({ message: 'Invalid Token' });

            req.user = req.user || {};
            req.user.username = authDetails.username;

            return next();
        } catch (err) {
            console.log(err)
            return next(err)
        }
    };
}