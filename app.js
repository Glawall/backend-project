const express = require("express");
const cors = require('cors');

const {
  respondCustomError,
  respondInternalServerError,
  respondPSQLErrors,
} = require("./errors.js");

const apiRouter = require("./routes/api-routers");

app.use(cors());

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(respondPSQLErrors);

app.use(respondCustomError);

app.use(respondInternalServerError);

module.exports = app;
