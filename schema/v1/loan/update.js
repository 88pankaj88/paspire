const Joi = require("joi");
const GlobalConstants = require('../../../utils/constants/globals');

module.exports = {
  loanId: Joi.string().required(),
  status: Joi.string().valid(...Object.values(GlobalConstants.LOAN_STATUS)).required(),
};
