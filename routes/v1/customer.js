const express = require("express");
const responseFormatter = require("../../utils/responseFormatter");
const router = express.Router();
const customerAuth = require("../../middleware/customerAuth.js");
const CustomerService = require("../../services/customer.service");
const Validation = require("../../middleware/joi");

router.post(
  "/auth",
  Validation.validate("v1", "customer", "authToken"),
  async function (req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await CustomerService.authenticate(username, password);
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

router.post("/logout", [customerAuth()], async function (req, res) {
  try {
    const authToken = req.headers.authorization;
    const result = await CustomerService.logout(authToken);
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
});

module.exports = router;
