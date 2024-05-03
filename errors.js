const app = require("./app.js");

const respondCustomError = (err, req, res, next) => {
  console.log(err)
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};
const respondPSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601" || err.code === "42703") {
    res.status(400).send({ message: "Bad request" });
  }
  if (err.code === "23503" && err.constraint === 'comments_article_id_fkey') {
    res.status(404).send({ message: "article not found" });
  }
  if (err.code === "23503" && err.constraint === "articles_author_fkey" || err.code === "23503" && err.constraint === "comments_author_fkey" ) {
    res.status(404).send({ message: "username not found" });
  }
  if (err.code === "23503" && err.constraint === "articles_topic_fkey") {
    res.status(404).send({ message: "topic not found" });
  }
  if (err.code === "23502"){
    res.status(400).send({ message: "Bad request" });
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
