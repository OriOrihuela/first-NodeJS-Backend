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
const MIDDLEWARE_AUTH = require("../middlewares/authenticated.middleware");

/**
 * Our router and its routes.
 */
const API = EXPRESS.Router();
API.get("/test", MIDDLEWARE_AUTH.ensureAuth, USER_CONTROLLER.test);
API.post("/register", USER_CONTROLLER.saveUser);
API.post("/login", USER_CONTROLLER.login);
API.put(
  "/update-user/:id",
  MIDDLEWARE_AUTH.ensureAuth,
  USER_CONTROLLER.updateUser
);

module.exports = API;
