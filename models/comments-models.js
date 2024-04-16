const db = require("../db/connection");

function fetchComments(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function insertComment(article_id, comment) {
  if (!comment.username || !comment.body) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [comment.username, comment.body, article_id]
    )
    .then(({rows}) => {
      return rows;
    });
}

module.exports = { fetchComments, insertComment };
