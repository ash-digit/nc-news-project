const express = require("express");
const {getTopics, getApi} = require("./controllers/topics.controller")
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api", getApi)


app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});


app.use((err, req, res, next) => {
  if (err.msg === '400 Bad Request') {
    res.status(400).send(err);
  } else {
    next(err);
  }
});





module.exports = app;