const db = require("../db/connection");

exports.users = () => {
  return db.query("SELECT * FROM users").then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ status: 404 });
    } else {
      return response.rows;
    }
  });
};
