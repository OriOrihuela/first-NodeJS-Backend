/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

// Call these two modules.
const express = require("express");
const bodyParser = require("body-parser");

// Call this module.
const app = express();

/**
 * Middlewares of body-parser
 * Whatever the body gets, it will conveted into a JSON.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Export the module
module.exports = app;