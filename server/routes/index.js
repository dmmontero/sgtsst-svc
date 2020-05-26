module.exports = (app) => {
  app.use(require("./usuario"));
  app.use(require("./categoria"));
  app.use(require("./login"));
};
