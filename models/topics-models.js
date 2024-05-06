const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function checkTopicExists(topic) {
  if (!topic) {
    return topic;
  }
  return db
    .query("SELECT slug FROM topics WHERE slug = $1", [topic])
    .then(({ rows: topics }) => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404, message: "topic not found" });
      }
    });
}

function insertTopic(topic) {
  if(!topic.slug || !topic.description){
    return Promise.reject({status: 400, message:"Bad request" })
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [topic.slug, topic.description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}
module.exports = { fetchTopics, checkTopicExists, insertTopic };
