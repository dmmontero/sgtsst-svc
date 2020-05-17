module.exports = (app) => {
  app.use(require("./usuario"));
  app.use(require("./login"));
};
