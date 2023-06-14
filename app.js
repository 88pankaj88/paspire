const express = require("express");
const path = require("path");
require("./utils/logger");
const cors = require("cors");
const app = express();

process.on("uncaughtException", function (err) {
  console.error(err)
});
process.on("unhandledRejection", function (err) {
  console.error(err)
});

const compression = require("compression");
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  express.static(path.join(__dirname, process.env.APP_STATIC_PATH || ""))
);

const indexRouter = require("./routes/index");
const customerRouter = require("./routes/v1/customer");
const adminRouter = require("./routes/v1/admin");
const repaymentRouter = require("./routes/v1/repayment");
const loanRouter = require("./routes/v1/loan");

app.use("/", indexRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/repayment", repaymentRouter);
app.use("/api/v1/loan", loanRouter);

app.use(function (req, res, next) {
  if (!req.timedout) {
    next();
  }
});
app.get("/", function (req, res) {
  res.status(200).send();
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

module.exports = app;
