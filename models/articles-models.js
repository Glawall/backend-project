const db = require("../db/connection");

function fetchArticle(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "invalid query" });
      }
      return rows[0];
    });
}

function fetchArticles() {

    // return db.query(`SELECT article_id, comment_count, title, author, created_at, votes, topic, article_img_url FROM articles ORDER BY created_at DESC;`)})
    // .then(({rows}) => {
    //     let fullArr = rows
        return db
        .query(
            "SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.votes, articles.topic, articles.article_img_url, COUNT(articles.article_id) comment_count FROM articles JOIN comments on comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
        ).then(({rows}) => {
            return rows
        })
    }




module.exports = { fetchArticle, fetchArticles };
