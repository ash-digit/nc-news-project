const articles = require("../db/data/test-data/articles")
const {
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId
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

exports.getArticles = (req, res, next) => {
    const{sortedBy, orderedBy} = req.query
    return selectArticles(sortedBy, orderedBy)
    .then((articles) => {
        res.status(200).send(articles)
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const{article_id} = req.params
    return selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send(comments)
    })
    .catch((err)=>{
        next(err)
    })
}
