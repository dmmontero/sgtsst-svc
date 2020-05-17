const express = require("express");
const http = require("http");
// Express configuration
const expressConfig = require("./server/config/express");
const routesConfig = require("./server/routes/index");

require("./server/config/config");

// Setup server
const app = express();
const server = http.createServer(app);

//Rutas de la API
expressConfig(app);

//Rutas de la API
routesConfig(app);

// Start server
function startServer() {
  app.nodeMDE = server.listen(process.env.PORT, () => {
    console.log(
      `Express server listening on ${process.env.PORT}, in ${process.env.NODE_ENV} mode`
    );
  });
}

setImmediate(startServer);
