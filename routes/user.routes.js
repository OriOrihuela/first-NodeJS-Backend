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

// Modules.
const MIDDLEWARE_AUTH = require("../middlewares/authenticated.middleware");
// To save images or folders by the users.
const MULTIPART = require("connect-multiparty");
const MIDDLEWARE_UPLOAD = MULTIPART({ uploadDir: "./uploads/users" });

// Our router and its routes.
const API = EXPRESS.Router();
// GET
API.get("/test", MIDDLEWARE_AUTH.ensureAuth, USER_CONTROLLER.test);
// POST
API.post("/register", USER_CONTROLLER.saveUser);
API.post("/login", USER_CONTROLLER.login);
API.post("/upload-image-user/:id", [MIDDLEWARE_AUTH.ensureAuth, MIDDLEWARE_UPLOAD], USER_CONTROLLER.uploadImage);
// PUT
API.put(
  "/update-user/:id",
  MIDDLEWARE_AUTH.ensureAuth,
  USER_CONTROLLER.updateUser
);

module.exports = API;
