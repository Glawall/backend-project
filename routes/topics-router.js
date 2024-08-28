const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopic,
  deleteTopic,
  getTopic,
} = require("../controllers/topics-controller");

topicsRouter.route("/").get(getTopics).post(postTopic);

topicsRouter.route("/:slug").get(getTopic).delete(deleteTopic);

module.exports = topicsRouter;
