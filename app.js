const express = require("express");

const {
  getTopics,
  getApi
  } = require("./controllers/topics.controller")

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  updateVoteArticle
} = require("./controllers/articles.controller")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments",getCommentsByArticleId)

app.patch("/api/articles/:article_id", updateVoteArticle)

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
  if(err.status === 406){
    res.status(406).send(err)
  }
});









module.exports = app;