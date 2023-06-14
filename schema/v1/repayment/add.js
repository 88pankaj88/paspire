const Joi = require("joi");

module.exports = {
  amount: Joi.number().positive().greater(0).required(),
  repaymentId: Joi.string().required()
};