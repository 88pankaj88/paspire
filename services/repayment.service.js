const moment = require("moment");

const LoanDao = require('../dao/loan.dao');
const GlobalConstants = require('../utils/constants/globals');
const RepaymentDao = require("../dao/repayment.dao");
const logger = require("../utils/logger");

const addRepayments = async function (loanObj) {
  try {
    for(let i=1; i<=loanObj.term; i++) {
      const repaymentValue = parseFloat(loanObj.amount / loanObj.term).toFixed(4);
      const repaymentDate = moment().add(7*i, 'days').format("YYYY-MM-DD");

      const repaymentObj = {
        loanId: loanObj.id,
        amount: repaymentValue,
        deadline: repaymentDate,
        status: GlobalConstants.REPAYMENT_STATUS.PENDING
      };
      RepaymentDao.add(repaymentObj);
    }
    return { value: { success: true } }
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};

const addPayment = function (username, repaymentId, amount) {
  try {
    const repaymentDetails = RepaymentDao.get(repaymentId);
    if(!repaymentDetails || repaymentDetails.status !== GlobalConstants.REPAYMENT_STATUS.PENDING) {
      return { value: { success: false, message: `Invalid Request` } };
    }
    const loanDetails = LoanDao.get(repaymentDetails.loanId);

    if(loanDetails.username !== username) {
      return { value: { success: false, message: `Loan does not belong to user` } };
    }
    if(loanDetails.status !== GlobalConstants.LOAN_STATUS.APPROVED) {
      return { value: { success: false, message: `Payment can't be accepted against unapproved loan` } };
    }

    if(amount >= repaymentDetails.amount) {
      repaymentDetails.status = GlobalConstants.REPAYMENT_STATUS.PAID;
    } else {
      return { value: { success: false, message: `Repayment amount is not sufficient` } };
    }

    RepaymentDao.update(repaymentDetails);
    checkIfLoanPaid(repaymentDetails.loanId);
    return { value: { success: true } }
  } catch (e) {
    logger.logInfo(e);
    return { value: { success: false } };
  }
};
const getAllRepayments = function(loanId) {
  try {
    return RepaymentDao.getAllRepayments(loanId);
  } catch (e) {
    logger.logInfo(e);
    return [];
  }
}

const checkIfLoanPaid = function(loanId) {
  const repayments = RepaymentDao.getAllRepayments(loanId);
  for(let i=0; i<repayments.length;i++) {
    if(repayments[i].status !== GlobalConstants.REPAYMENT_STATUS.PAID) return;
  }
  const loanDetails =  LoanDao.get(loanId);
  loanDetails.status = GlobalConstants.LOAN_STATUS.PAID;
  LoanDao.update(loanDetails);
} 

module.exports = {
    addRepayments,
    addPayment,
    getAllRepayments
};