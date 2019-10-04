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

// Load our routes
const USER_ROUTES = require("./routes/user.routes");

// Base routes, with their own routing prefix.
APP.use("/api", USER_ROUTES);

// Export the module
module.exports = APP;
