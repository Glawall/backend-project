const {
  fetchArticle,
  fetchArticles,
  updateArticleVotes,
  checkArticleExists,
} = require("../models/articles-models");

const { checkTopicExists } = require("../models/topics-models")
;
const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const {sort_by, order, topic } = req.query;
  Promise.all([fetchArticles(sort_by, order, topic), checkTopicExists(topic)])
    .then(([articles]) => {
      res.status(200).send({articles});
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body;
  Promise.all([
    checkArticleExists(article_id),
    updateArticleVotes(article_id, inc_votes),
  ])
    .then(([undefined, article]) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, getArticles, patchArticle };
