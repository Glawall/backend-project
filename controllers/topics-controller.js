const {
  fetchTopics,
  insertTopic,
  checkTopicExists,
  removeTopic,
  fetchTopic,
} = require("../models/topics-models.js");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getTopic = (req, res, next) => {
  const { slug } = req.params;
  fetchTopic(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
const postTopic = (req, res, next) => {
  const topic = req.body;
  insertTopic(topic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteTopic = (req, res, next) => {
  const { slug } = req.params;
  console.log(req.params);
  Promise.all([checkTopicExists(slug), removeTopic(slug)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getTopics, postTopic, deleteTopic, getTopic };
