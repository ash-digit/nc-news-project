const db = require("../db/connection")


exports.selectTopics = ()=>{
    return db.query(
        `SELECT * FROM topics`
    )
    .then((topics) => {
        if(topics.lenth === 0){
            return Promise.reject({status: 404, msg: "404 Not Found"})
        }
        return topics.rows;
    })
}
