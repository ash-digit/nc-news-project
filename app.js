const express = require("express");
const {getTopics} = require("./controllers/topics.controller")
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
  if (err.msg === '400 Bad Request') {
    res.status(400).send(err);
  } else {
    next(err);
  }
});


// app.listen(3090, () => {
//   console.log('Server is running on port 3090');
// });


module.exports = app;