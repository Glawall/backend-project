const app = require("./app.js");

const respondCustomError = (err, req, res, next) => {
  console.log(err)
  console.log(err.status)
  if (err.status && err.message) {
    res.status(error.status).send({ message: error.message });
  }
  next(err);
};
const respondPSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601") {
    res.status(400).send({ message: "Bad request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ message: "username not found" });
  }
  next(err);
};

const respondInternalServerError = (err, req, res, next) => {
  res.status(500).send("internal server error");
};

module.exports = {
  respondCustomError,
  respondPSQLErrors,
  respondInternalServerError,
};
