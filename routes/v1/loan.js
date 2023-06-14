const express = require("express");
const responseFormatter = require("../../utils/responseFormatter");
const router = express.Router();
const customerAuth = require("../../middleware/customerAuth.js");
const LoanService = require("../../services/loan.service");
const Validation = require("../../middleware/joi");
const adminAuth = require("../../middleware/adminAuth");

router.post(
  "/",
  [customerAuth()],
  Validation.validate("v1", "loan", "apply"),
  async function (req, res) {
    try {
      const username = req.user.username
      const loanDetails = {
        amount: req.body.amount,
        term: req.body.term
      };
      const result = await LoanService.apply(username, loanDetails);
      return responseFormatter(result, req, res);
    } catch (error) {
      return responseFormatter(
        {
          error: {
            type: "error",
            message: error.message,
            data: { error },
          },
        },
        req,
        res
      );
    }
  }
);

router.put(
    "/:loanId",
    [adminAuth()],
    Validation.validate("v1", "loan", "update"),
    async function (req, res) {
      try {
        const loanId = req.params.loanId;
        const status = req.body.status;
        const result = await LoanService.updateLoanStatus(loanId, status);
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
      const username = req.user.username;
      const loanId = req.params.loanId;
      const result = await LoanService.getLoanDetails(username, loanId);
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
