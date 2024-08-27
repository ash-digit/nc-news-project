const {
    selectTopics
} = require("../models/topics.models")


 exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((response) => {
        res.status(200).send(response)
    })
    .catch(next)
}


