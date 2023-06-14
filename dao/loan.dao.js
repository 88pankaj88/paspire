const uuid = require("uuid");


const LoanData = require('../models/loan');

const add = function (loanObj) {
    try {
        const loanId = uuid.v4();
        loanObj.id = loanId;
        LoanData[loanId] = loanObj;
        return loanId;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
};

const get = function(loanId) {
    try {
        return LoanData[loanId];
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
};

const update = function(loanObj) {
    try {
        const loanId = loanObj['id'];
        return LoanData[loanId] = loanObj;
    } catch (error) {
        return { error: { type: "error", message: error.message, data: { ...error.spread() } } }
    }
}

module.exports = {
    add,
    get,
    update
}