const { fetchTopics, insertTopic } = require("../models/topics-models.js");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const postTopic = (req, res, next) => {
  const topic = req.body
  insertTopic(topic)
  .then((topic) => {
    res.status(201).send({topic})
  })
  .catch((err) => {
    next(err)
  })
}
module.exports = { getTopics, postTopic };
