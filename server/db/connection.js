const mongoose = require("mongoose");

/**
 * Connecto DB
 */
module.exports = () => {
  mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function () {
    console.log(`we are connected to ${process.env.urlDB}`);
  });
};
