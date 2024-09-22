const errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ status: 404, msg: "Not Found" });
  } else if (err.status === 400) {
    res.status(400).send({ status: 400, msg: err.msg });
  } else if (err.status === undefined) {
    res
      .status(400)
      .send({ status: 400, msg: "Bad Request", info: "PSQL/QUERY/NOT-VALID" });
  } else if (err.status === 406) {
    res.status(406).send(err);
  } else {
    // For any other errors, send a 500 Internal Server Error
    res.status(500).send({ status: 500, msg: "Internal Server Error" });
  }
};

// app.use((err, req, res, next) => {
//     if (err.status && err.msg) {
//       res.status(err.status).send({ msg: err.msg });
//     } else {
//       console.error(err.stack);
//       res.status(500).send({ msg: 'Internal Server Error' });
//     }
//   });

module.exports = errorHandler;
