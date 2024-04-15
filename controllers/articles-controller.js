const { fetchArticles } = require("..//models/articles-models");

const getArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles };