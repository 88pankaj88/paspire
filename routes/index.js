const express = require("express");
const router = express.Router();

router.get("/api/ping", function (req, res) {
  res.status(200).json({ response: { isAlive: true }, error: null });
});

router.get("/api/healthstats", async function (req, res) {
  try {
    const systemHealthStatus = {
      isAlive: true,
    };
    res.status(200).json({ response: systemHealthStatus, error: null });
  } catch (error) {
    res.status(501).json({ response: null, error: error });
  }
});

module.exports = router;
