const {fetchComments, insertComment} = require("../models/comments-models")

const getComments = (req, res, next) => {
    const {article_id} = req.params
    fetchComments(article_id)
    .then((comments) => [
      res.status(200).send({comments})
    ])
    .catch((err) => {
      next(err)
    })
  }

const postComment = (req,res,next) => {
  const {article_id} = req.params
  const body = req.body
  insertComment(article_id, body).then((comment) => {
    res.status(201).send({comment})
  })
  .catch((err) => {
    next(err)
  })
}
  module.exports = {getComments, postComment}