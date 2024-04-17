const { fetchComments, insertComment, removeComment, checkCommentExists} = require("../models/comments-models");
const { checkArticleExists } = require("../models/articles-models");

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([checkArticleExists(article_id), fetchComments(article_id)])
    .then(([undefined, comment]) => {
    res.status(200).send(comment)})
    .catch((err) => {
      next(err);
    })
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  Promise.all([checkArticleExists(article_id), insertComment(article_id, body)])
    .then(([undefined, comment]) => 
    {
      res.status(201).send(comment[0])
  
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const {comment_id} = req.params
  Promise.all([checkCommentExists(comment_id), removeComment(comment_id)]).then(() => {
    res.status(204).send()
  })
  .catch((err) => {
    next(err)
  })

}
module.exports = { getComments, postComment, deleteComment };
