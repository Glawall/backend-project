


// app.use((err, req, res, next) => {
//     if (err.status && err.message) {
//       res.status(err.status).send({ message: err.message });
//     }
//     next(err);
//   }),
  
//   app.use((err, req, res, next) => {
//     if (err.code === "22P02") {
//       res.status(400).send({ message: "Bad request" });
//     }
//     next(err);
//   }),
  
//   app.use((err, req, res, next) => {
//     res.status(500).send("internal server error");
//   })

