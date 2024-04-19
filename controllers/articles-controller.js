const {
  fetchArticle,
  fetchArticles,
  updateArticleVotes,
  checkArticleExists,
  insertArticle
} = require("../models/articles-models");

const { checkTopicExists } = require("../models/topics-models")
;
const { checkUserExists } = require("../models/users-models");
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
    updateArticleVotes(article_id, inc_votes),
    checkArticleExists(article_id),
    
  ])
    .then(([article]) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req,res,next) => {
  const article = req.body
  Promise.all([insertArticle(article), checkTopicExists(article.topic), checkUserExists(article.author)]).then(([article])=> {
    res.status(201).send({article})
  })
  .catch((err) => {
    next(err)
  })
}
module.exports = { getArticle, getArticles, patchArticle, postArticle };
