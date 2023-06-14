const Joi = require("joi");

module.exports = {
  username: Joi.string().required(),
  password: Joi.string().required()
};
