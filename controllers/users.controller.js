const { users } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  return users().then((users) => {
    res.send(users);
  });
};
