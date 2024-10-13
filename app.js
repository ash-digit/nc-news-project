const cors = require("cors");
const express = require("express");
const errroHandler = require("./error-handler-middleware");
const { getTopics, getApi } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  updateVoteArticle,
  deleteComment,
  postACommentForAnArticle,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", updateVoteArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.post("/api/articles/:article_id/comments", postACommentForAnArticle);
app.get("/api/users", getUsers);

app.use(errroHandler);

module.exports = app;
