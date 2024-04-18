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

app.use(respondPSQLErrors)
app.use(respondCustomError)
app.use(respondInternalServerError);


module.exports = app;
