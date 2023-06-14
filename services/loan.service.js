const moment = require("moment");

const GlobalConstants = require('../utils/constants/globals');
const LoanDao = require("../dao/loan.dao");
const RepaymentService = require("./repayment.service");
const logger = require("../utils/logger");

const apply = async function (username, loanDetails) {
  try {
    const today = moment().format("YYYY-MM-DD");

    const loanObj = {
      appliedOn: today,
      username,
      amount: loanDetails.amount,
      term: loanDetails.term,
      status: GlobalConstants.LOAN_STATUS.PENDING
    };
    const loanId = LoanDao.add(loanObj);
    loanObj.id = loanId;
    RepaymentService.addRepayments(loanObj);

    const repayments = RepaymentService.getAllRepayments(loanId);
    return { value: { success: true, repayments } };
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const updateLoanStatus = async function(loanId, newStatus) {
  try {
    const loanObj = LoanDao.get(loanId);
    if(!loanObj || loanObj.status !== GlobalConstants.LOAN_STATUS.PENDING) {
      return { value: { success: false, message: `Invalid loan Id` } };
    }
    if(! [GlobalConstants.LOAN_STATUS.APPROVED, GlobalConstants.LOAN_STATUS.rejectedBy].includes(newStatus) ) {
      return { value: { success: false, message: `Invalid admin action` } };
    }
    loanObj.status = newStatus;
    LoanDao.update(loanObj);
    return { value: { success: true } };
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const getLoanDetails = function (username, loanId) {
  try {
    const loanObj = LoanDao.get(loanId);
    if(!loanObj || loanObj['username'] !== username) {
      return { value: { success: false, message: `Invalid Request` } };
    }
    return { value: { success: true, loan: loanObj } };
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};


module.exports = {
  apply,
  updateLoanStatus,
  getLoanDetails,
};
