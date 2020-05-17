/**
 * Express configuration
 * @author: Danny M Montero
 */

const compression = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const errorHandler = require("errorhandler");
const cors = require("cors");
// const morgan = require("morgan");
const db = require("../db/connection");

module.exports = (app) => {
  const env = process.env.NODE_ENV;

  app.use(compression());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(methodOverride());
  // app.use(morgan("tiny"));
  app.use(cors());

  if (env === "dev" || env === "test") {
    app.use(errorHandler()); // Error handler - has to be last
  }

  //Connect to Data Base
  db();

};
