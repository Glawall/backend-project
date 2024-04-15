const { fetchArticle, fetchArticles } = require("..//models/articles-models");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({articles});
    })
    .catch((err) => {
        console.log(err)
      next(err);
    });
};
module.exports = { getArticle, getArticles };
