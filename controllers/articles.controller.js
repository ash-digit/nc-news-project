const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updatVoteById,
  deleteCommentById,
  postACommentByArticleId,
  selectArticleByIdOrTopic,
  getCommntCountByArticleId,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  if (req.query.count != undefined) {
    if (req.query.count == "true") {
      const { article_id } = req.params;
      return getCommntCountByArticleId(article_id).then((commentCount) => {
        res.status(200).send(commentCount);
      });
    } else {
      const { article_id } = req.params;
      return selectArticleByIdOrTopic(article_id)
        .then((article) => {
          res.status(200).send(article);
        })
        .catch((err) => {
          next(err);
        });
    }
  } else {
    const { article_id } = req.params;
    return selectArticleByIdOrTopic(article_id)
      .then((article) => {
        res.status(200).send(article);
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getArticles = (req, res, next) => {
  const { sortedBy, orderedBy } = req.query;
  return selectArticles(sortedBy, orderedBy)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVoteArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  return updatVoteById(inc_votes, article_id)
    .then((article) => {
      res.status(201).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.postACommentForAnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  return postACommentByArticleId(article_id, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((error) => {
      next(error);
    });
};
