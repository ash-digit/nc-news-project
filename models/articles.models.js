const db = require("../db/connection")

exports.selectArticleById = (article_id) =>{
    return db.query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((article)=>{
        if(article.rows.length === 0){
           return Promise.reject({status: 404, msg: "404 Not Found"})
        }else{
            return article.rows
        }
    })
    .catch((err)=>{
        throw err
    })
}

exports.selectArticles = ()=>{
    return db.query(
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
    ).then((response)=>{
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: "404 Not Found"})
        }
        return response.rows
    }).catch((err) =>{
        throw err
    })
}
