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
