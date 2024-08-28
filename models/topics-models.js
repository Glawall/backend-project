const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchTopic(slug) {
  return db
    .query(
      `SELECT topics.slug, topics.description FROM topics WHERE topics.slug=$1`,
      [slug]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "invalid query" });
      }
      return rows[0];
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
  if (!topic.slug || !topic.description) {
    return Promise.reject({ status: 400, message: "Bad request" });
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

function removeTopic(slug) {
  return db.query(`DELETE FROM topics WHERE topics.slug =$1`, [slug]);
}
module.exports = {
  fetchTopics,
  fetchTopic,
  checkTopicExists,
  insertTopic,
  removeTopic,
};
