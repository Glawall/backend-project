const db = require("../db/connection");

function fetchArticles(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, message: "invalid query"})
        }
      return rows[0];
    });
}

module.exports = { fetchArticles };
