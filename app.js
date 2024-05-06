const express = require("express");
const cors = require('cors');

const {
  respondCustomError,
  respondInternalServerError,
  respondPSQLErrors,
} = require("./errors.js");

app.use(cors());


const apiRouter = require("./routes/api-routers");


const app = express();


app.use(express.json());

app.use("/api", apiRouter);

app.use(respondPSQLErrors);

app.use(respondCustomError);

app.use(respondInternalServerError);

module.exports = app;
