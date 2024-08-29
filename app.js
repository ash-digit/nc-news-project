const express = require("express");
const {getTopics, getApi} = require("./controllers/topics.controller")
const {
  getArticleById,
  getArticles
} = require("./controllers/articles.controller")
const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)


app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {
  if (err.status === 404) {
      res.status(err.status).send({status: 404, msg: err.msg });
  }
  if(err.status === 400){
    res.status(err.status).send({status: 400, msg: err.msg });
  }
  if(err.status === undefined){
    res.status(400).send({status: 400, msg: "Bad Request", info: "PSQL/QUERY/NOT-VALID"})
  }
});









module.exports = app;