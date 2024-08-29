const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectTopics = ()=>{
    return db.query(
        `SELECT * FROM topics`
    )
    .then((topics) => {
        if(topics.rows.length === 0){
            return Promise.reject( {status: 404, msg: "404 Not Found", src: "selectTopics()"})
        }else{
        return topics.rows;
        }
    }).catch((err)=>{
        throw err
    })
}
exports.fetchApi = ()=>{
    return fs.readFile(`./endpoints.json`, "utf-8")
    .then((respnse) =>{
            return JSON.parse(respnse)
    })
}





