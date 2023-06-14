const Joi = require("joi");

module.exports = {
  amount: Joi.number().integer().positive().greater(0).required(),
  term: Joi.number().integer().positive().greater(0).required(),
};
