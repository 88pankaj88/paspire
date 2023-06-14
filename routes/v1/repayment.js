const express = require("express");
const responseFormatter = require("../../utils/responseFormatter");
const router = express.Router();
const customerAuth = require("../../middleware/customerAuth.js");
const RepaymentService = require("../../services/repayment.service");
const Validation = require("../../middleware/joi");
const adminAuth = require("../../middleware/adminAuth");

router.post(
  "/pay/:repaymentId",
  [customerAuth()],
  Validation.validate("v1", "repayment", "add"),
  async function (req, res) {
    try {
      const username = req.user.username;
      const repaymentId = req.params.repaymentId;
      const amount = req.body.amount;
      const result = await RepaymentService.addPayment(username, repaymentId, amount);
      return responseFormatter(result, req, res);
    } catch (error) {
      return responseFormatter(
        {
          error: {
            type: "error",
            message: error.message,
            data: { ...error.spread() },
          },
        },
        req,
        res
      );
    }
  }
);

router.put(
    "/",
    [adminAuth()],
    Validation.validate("v1", "loan", "update"),
    async function (req, res) {
      try {
        const username = req.user.username;
        const loanId = req.body.loanId;
        const status = req.body.status;
        const result = await LoanService.updateLoanStatus(username, loanId, status);
        return responseFormatter(result, req, res);
      } catch (error) {
        return responseFormatter(
          {
            error: {
              type: "error",
              message: error.message,
              data: { ...error.spread() },
            },
          },
          req,
          res
        );
      }
    }
);

router.get(
  "/:loanId",
  [customerAuth()],
  async function (req, res) {
    try {
      const loanId = req.params.loanId;
      const result = await LoanService.updateLoanStatus(username, loanId, status);
      return responseFormatter(result, req, res);
    } catch (error) {
      return responseFormatter(
        {
          error: {
            type: "error",
            message: error.message,
            data: { ...error.spread() },
          },
        },
        req,
        res
      );
    }
  }
);

module.exports = router;
