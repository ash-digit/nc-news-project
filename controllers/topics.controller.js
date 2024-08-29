const {
    selectTopics,
    fetchApi
} = require("../models/topics.models")


 exports.getTopics = (req, res, next) => {
    
    return selectTopics()
    .then((topics) =>{
        res.status(200).send(topics)
    })
    .catch((err)=>{
        next(err)
    })
}


exports.getApi = (req, res, next) => {
    return fetchApi()
    .then((api)=>{
        res.status(200).send(api)
    })
    .catch((err)=>{
        next(err)
    })
}

