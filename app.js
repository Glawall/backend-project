const express = require("express");
const {
  getHealthResponse,
  getApiInformation,
} = require("./controllers/api-controller");
const { getTopics } = require("./controllers/topics-controller");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comments-controller");

const {
    getUsers
  } = require("./controllers/users-controller");

const {
  respondCustomError,
  respondInternalServerError,
  respondPSQLErrors,
} = require("./errors.js");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getHealthResponse);

app.get("/api/topics", getTopics);

app.get("/api", getApiInformation);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers)

// app.use(respondPSQLErrors)
// app.use(respondCustomError)
// app.use(respondInternalServerError);


app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601") {
    res.status(400).send({ message: "Bad request" });
  }
  if(err.code === "23503"){
    res.status(404).send({message: "username not found"})
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("internal server error");
});

module.exports = app;
