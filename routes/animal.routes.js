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
const ANIMAL_CONTROLLER = require("../controllers/animal.controller");

// Modules.
const MIDDLEWARE_AUTH = require("../middlewares/authenticated.middleware");
// To save images or folders by the users.
const MULTIPART = require("connect-multiparty");
const MIDDLEWARE_UPLOAD = MULTIPART({ uploadDir: "./uploads/animals" });

// Our router and its routes.
const API = EXPRESS.Router();

// GET
API.get("/animals", ANIMAL_CONTROLLER.getAnimals);
API.get("/animal/:id", ANIMAL_CONTROLLER.getAnimal);
API.get("/get-image-animal/:imageFile", ANIMAL_CONTROLLER.getImageFile);

// POST
API.post("/animal", MIDDLEWARE_AUTH.ensureAuth, ANIMAL_CONTROLLER.saveAnimal);
API.post("/upload-image-animal/:id", [MIDDLEWARE_AUTH.ensureAuth, MIDDLEWARE_UPLOAD], ANIMAL_CONTROLLER.uploadImage);

// PUT
API.put("/animal/:id", MIDDLEWARE_AUTH.ensureAuth, ANIMAL_CONTROLLER.updateAnimal);

module.exports = API;
