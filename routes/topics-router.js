const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller");

topicsRouter.use(getTopics).get("/", (req, res) => {
  res.status(200).send("all OK from api/topics");
});

module.exports = topicsRouter;
