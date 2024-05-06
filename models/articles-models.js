const db = require("../db/connection");

function fetchArticle(article_id) {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.votes, articles.topic, articles.article_img_url, articles.body, CAST(COUNT(articles.article_id) AS INTEGER) comment_count  FROM articles LEFT JOIN comments on comments.article_id = articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "invalid query" });
      }
      return rows[0];
    });
}

function fetchArticles(sort_by = "created_at", order = "desc", topic, limit = 10, p = 1) {
const validSortBys = [
  "article_id",
  "title",
  "author",
  "comment_count",
  "created_at",
  "votes",
  "topic"
]
const validOrders = [
  "asc",
  "desc"
]


const validLimit = Number

if(!validSortBys.includes(sort_by) || !validOrders.includes(order)) {
  return Promise.reject({status: 400, message: "invalid query value"})
}

  let stringQuery = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.votes, articles.topic, articles.article_img_url, (SELECT CAST(COUNT(articles.article_id) AS INTEGER) total_count FROM articles), CAST(COUNT(articles.article_id )-1 AS INTEGER) comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id `;

  const queryVals = [];

  if (topic) {
    stringQuery += `WHERE topic =$1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET (${p}-1)*${limit}`;
    queryVals.push(topic);
  } else {
    stringQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET (${p}-1)*${limit}`;
  }

  return db.query(stringQuery, queryVals).then(({ rows }) => {
    console.log(rows)
    return rows;
  });
}

function checkArticleExists(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
    });
}

function updateArticleVotes(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles SET votes = ${inc_votes.inc_votes} WHERE article_id=$1 RETURNING *`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function insertArticle(article) {
  return db.query('INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [article.author, article.title, article.body, article.topic, article.article_img_url])
  .then(({rows}) => {
    const id = rows[0].article_id
    return db.query(`SELECT articles.article_id, articles.title, articles.author, articles.body, articles.created_at, articles.votes, articles.topic, articles.article_img_url, CAST(COUNT(comments.article_id)  AS INTEGER) comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id WHERE articles.article_id =$1 GROUP BY articles.article_id`, [id])
  })
  .then(({rows}) => {
    return rows[0]
  })
}

function removeArticle(article_id) {
  return db.query(`DELETE FROM articles WHERE article_id =$1`, [article_id])
}

module.exports = {
  fetchArticle,
  fetchArticles,
  checkArticleExists,
  updateArticleVotes,
  insertArticle,
  removeArticle
};
