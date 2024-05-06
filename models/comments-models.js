const db = require("../db/connection");

function fetchComments(article_id, limit=10, p=1) {
  console.log(p)
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC LIMIT ${limit} OFFSET (${p}-1)*${limit}`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function insertComment(article_id, comment) {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [comment.username, comment.body, article_id]
    )
    .then(({rows}) => {
      return rows;
    });
}

function removeComment(comment_id) {
return db.query(`DELETE FROM comments where comment_id = $1`, [comment_id])
}

function checkCommentExists(comment_id){
  return db
  .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
  .then(({ rows: comment }) => {
    if (comment.length === 0) {
      return Promise.reject({ status: 404, message: "comment not found" });
    }
  });
}

function updateComment(comment_id, body){
  return db.query(`UPDATE comments SET votes = (votes+ ${body.inc_votes}) WHERE comment_id=$1 RETURNING *`,
  [comment_id])
  .then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { fetchComments, insertComment, removeComment, checkCommentExists, updateComment };
