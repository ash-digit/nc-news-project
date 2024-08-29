const articles = require("../db/data/test-data/articles")
const {
    selectArticleById,
    selectArticles
} = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    return selectArticleById(article_id)
    .then((article) =>{
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err)
    })
}

getArticles = () => {
    return selectArticles()
    .then((articles) => {
        console.log(articles)
    })
    .catch((err)=>{
        console.log(err)
    })
}
getArticles()