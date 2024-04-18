const apiRouter = require("express").Router();

const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

const {
  getHealthResponse,
  getApiInformation,
} = require("../controllers/api-controller");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/", getApiInformation);

apiRouter.use("/healthchecker", getHealthResponse);

module.exports = apiRouter;
