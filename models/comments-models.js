const db = require("../db/connection");

function fetchComments(article_id) {
    return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, message: "invalid query"})
        }
        return rows
    })
}

function insertComment(article_id, comment) {

    console.log(comment)
    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *', [comment.username, comment.body, article_id])
    .then(({rows}) => {
        return rows[0]
    })

}



module.exports = {fetchComments, insertComment}