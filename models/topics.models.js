const db = require("../db/connection")
const fs = require("fs/promises")

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

exports.fetchApi = ()=>{
    return fs.readFile(`./endpoints.json`, "utf-8")
    .then((respnse) =>{
        return JSON.parse(respnse)
    })
    .catch((err)=>{
        console.log(err)
    })
}


