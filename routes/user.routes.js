/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * We need to invoke ExpressJS to be able to create our own custom routes.
 * Then, the specific controller will be also called.
 */
const EXPRESS = require("express");
const USER_CONTROLLER = require("../controllers/user.controller");

/**
 * Our router and its routes.
 */
const API = EXPRESS.Router();
API.get("/pruebas-del-controlador", USER_CONTROLLER.test);

module.exports = API;
