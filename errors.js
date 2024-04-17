const app = require("./app.js")


const respondCustomError = ((err, req, res, next) => {
        if (err.status && err.message) {
          res.status(error.status).send({ message: error.message });
        }
        next(err);
      })
const respondPSQLErrors = ((err, req, res, next) => {
        if (err.code === "22P02") {
          res.status(400).send({ message: "Bad request" });
        }
        next(err);
      })

const respondInternalServerError = ((err, req, res, next)=> {
        res.status(500).send("internal server error");
      })

module.exports = {respondCustomError, respondPSQLErrors, respondInternalServerError}


