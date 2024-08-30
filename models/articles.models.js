const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 Not Found",
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

exports.selectArticles = (sortedBy, orderedBy) => {
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
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
          src: "selectCommentsByArticleId(id)",
        });
      } else {
        return comments.rows;
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.updatVoteById = (inc_votes, article_id) => {   
  const query = `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`;
  return db
    .query(query, [inc_votes, article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
          src: "selectCommentsByArticleId(id)",
        });
      }
      return article.rows[0];
    })
    .catch((err) => {
        if( typeof inc_votes !== "number"){
            throw {status: 406, msg: "Not Acceptable", info: "Non Numerical Insertion:TRUE" }
        }else{
            throw err
        }
    })
};