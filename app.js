/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

// Call these two modules.
const EXPRESS = require("express");
const BODYPARSER = require("body-parser");

// Call this module.
const APP = EXPRESS();

/**
 * Middlewares of body-parser
 * Whatever the body gets, it will converted into a JSON.
 */
APP.use(BODYPARSER.urlencoded({ extended: false }));
APP.use(BODYPARSER.json());

// Configuration about headers and cors to allow AJAX requests from a domain to another, in our case from the client to our API.
APP.use((request, response, next) => {
  response.header("Acces-Control-Allow-Origin", "*");
  response.header(
    "Acces-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  response.header(
    "Acces-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  response.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Load our routes
const USER_ROUTES = require("./routes/user.routes");
const ANIMAL_ROUTES = require("./routes/animal.routes");

// Base routes, with their own routing prefix.
APP.use("/api", USER_ROUTES);
APP.use("/api", ANIMAL_ROUTES);

// Export the module
module.exports = APP;
