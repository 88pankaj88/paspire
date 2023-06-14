const express = require("express");
const responseFormatter = require("../../utils/responseFormatter");
const router = express.Router();
const AdminAuth = require("../../middleware/adminAuth.js");
const AdminService = require("../../services/admin.service");
const Validation = require("../../middleware/joi");

router.post(
  "/auth",
  Validation.validate("v1", "admin", "authToken"),
  async function (req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await AdminService.authenticate(username, password);
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

router.post("/logout", [AdminAuth()], async function (req, res) {
  try {
    const authToken = req.headers.authorization;
    const result = await AdminService.logout(authToken);
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
