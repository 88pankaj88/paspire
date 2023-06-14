const uuid = require("uuid");

const RepaymentData = require('../models/repayment');
const LoanRepaymentCache = {};

const add = function (repaymentObj) {
    try {
        const repaymentId = uuid.v4();
        repaymentObj.id = repaymentId;
        RepaymentData[repaymentId] = repaymentObj;
        LoanRepaymentCache[repaymentObj.loanId] = LoanRepaymentCache[repaymentObj.loanId] || [];
        LoanRepaymentCache[repaymentObj.loanId].push(repaymentId);

        return repaymentId;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
};

const get = function (repaymentId) {
    try {
        return RepaymentData[repaymentId];
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
};

const update = function(repaymentObj) {
    try {
        const repaymentId = repaymentObj['id'];
        return RepaymentData[repaymentId] = repaymentObj;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
};

const getAllRepayments = function(loanId) {
    try {
        const repaymentIds = LoanRepaymentCache[loanId];
        const repayments = [];
        //Below operation can be done via one db query, but have to run a loop as we are storing in-memory only
        for(let i=0; i< repaymentIds.length; i++) {
            repayments.push(RepaymentData[repaymentIds[i]]);
        }
        return repayments;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
}

module.exports = {
    add,
    get,
    update,
    getAllRepayments
}