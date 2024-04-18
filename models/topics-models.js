const db = require("../db/connection")


function fetchTopics() {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows
    })
}

function checkTopicExists(topic) {
    if(!topic){
        return topic
    }
    return db
      .query("SELECT slug FROM topics WHERE slug = $1", [topic])
      .then(({ rows: topics }) => {
        if (topics.length === 0) {
          return Promise.reject({ status: 404, message: "topic not found" });
        }
      });
  }
module.exports = {fetchTopics, checkTopicExists}