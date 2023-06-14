const Joi = require("joi");
module.exports.validate = (version, routeFile, schema) => (req, res, next) => {
  let schemaDetails = require("../schema/" +
    version +
    "/" +
    routeFile +
    "/" +
    schema);
  const { error } = Joi.object()
    .keys(schemaDetails)
    .validate({ ...req.body, ...req.params });
  if (error) {
    res.status(412).json({ message: error.details[0].message });
  } else {
    return next();
  }
};
