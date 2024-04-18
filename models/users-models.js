const db = require("../db/connection");

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function fetchUser(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      return rows[0];
    });
}

function checkUserExists(username) {
    if(!isNaN(Number(username))){
        return Promise.reject({ status: 400, message: "invalid query" });
    }

  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "user does not exist" });
      }
    });
}

module.exports = { fetchUsers, fetchUser, checkUserExists };
