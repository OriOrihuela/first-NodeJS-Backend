/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Modules
 */
// This variable allows us to work with the file library extension of NodeJS.
const FS = require("fs");
// To get acces to file routes within our file directory.
const PATH = require("path");

/**
 * Models
 */
const User = require("../domain/model/user.model");
const Animal = require("../domain/model/animal.model");

/**
 * ACTIONS
 */
function testAnimal(request, response) {
  response.status(200).send({
    message: "Testing the animal.controller.js.",
    user: request.user
  });
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
    testAnimal
  };
