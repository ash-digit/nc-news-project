const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          src: "selectArticleById()",
        });
      } else {
        return article.rows[0];
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectArticles = (sortedBy = "date", orderedBy = "DESC") => {
  if (sortedBy === "date" && orderedBy === "DESC") {
    return db
      .query(
        `SELECT 
                articles.author, 
                articles.title, 
                articles.article_id, 
                articles.topic, 
                articles.created_at, 
                articles.votes, 
                articles.article_img_url, 
                COUNT(comments.comment_id) AS comment_count
            FROM 
                articles
            LEFT JOIN 
                comments ON comments.article_id = articles.article_id
            GROUP BY 
                articles.article_id
            ORDER BY 
                articles.created_at DESC`
      )
      .then((response) => {
        return response.rows;
      })
      .catch((err) => {
        throw err;
      });
  } else {
    throw {
      status: 400,
      msg: "Bad Request",
      src: "selectArticles(sortedBy, orderedBy)",
    };
  }
};

exports.selectCommentsByArticleId = (article_id) => {
  const articleQuery = `SELECT * FROM articles WHERE article_id=$1`;
  return db.query(articleQuery, [article_id]).then((response) => {
    if (response.rows.length === 0) {
      // console.log(`article with id: ${article_id} does not exist!`);
      return Promise.reject({
        status: 404,
      });
    } else {
      const query = `
        SELECT 
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
        FROM 
            comments
        WHERE 
            article_id = $1
        ORDER BY 
            created_at DESC;
    `;
      return db
        .query(query, [article_id])
        .then((response) => {
          return response.rows;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    }
  });
};

exports.updatVoteById = (inc_votes, article_id) => {
  const queryForChecking = `SELECT * FROM articles WHERE article_id = $1`;
  return db
    .query(queryForChecking, [article_id])
    .then((respons) => {
      if (respons.rows.length === 0) {
        return Promise.reject({
          status: 404,
          src: "selectCommentsByArticleId(id)",
        });
      } else {
        const query = `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`;
        return db
          .query(query, [inc_votes, article_id])
          .then((article) => {
            return article.rows[0];
          })
          .catch(() => {
            if (isNaN(inc_votes)) {
              throw {
                status: 400,
                msg: "Bad Request",
                info: "Non Numerical Insertion:TRUE",
              };
            }
          });
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.deleteCommentById = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  return db
    .query(query, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
      return;
    })
    .catch((err) => {
      if (isNaN(comment_id)) {
        throw { status: 400, msg: "Bad Request" };
      }
      throw err;
    });
};

exports.postACommentByArticleId = (article_id, comment) => {
  const { author, body } = comment;
  if (isNaN(article_id)) {
    throw { status: 400, msg: "Bad Request" };
  }
  const article_query = "SELECT * FROM articles WHERE article_id=$1";
  return db.query(article_query, [article_id]).then((articleResult) => {
    if (articleResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    } else {
      const author_query = "SELECT * FROM users WHERE username=$1";
      return db.query(author_query, [author]).then((authorResult) => {
        if (authorResult.rows.length === 0) {
          console.log(author, "does not exist!");
          return Promise.reject({
            status: 404,
            msg: `Author: ${author} Not Found`,
          });
        } else {
          const query =
            "INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *";
          return db
            .query(query, [author, body, article_id])
            .then((commentResult) => {
              return commentResult.rows[0];
            });
        }
      });
    }
  });
};
