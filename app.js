const express = require("express");
const {getTopics, getApi} = require("./controllers/topics.controller")
const {getArticleById} = require("./controllers/articles.controller")
const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)


app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
    console.log(err)
  if (err.status === 404) {
    
      res.status(err.status).send({status: 404, msg: err.msg });
  }
});









module.exports = app;