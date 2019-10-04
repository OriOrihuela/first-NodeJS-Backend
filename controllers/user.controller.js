/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Modules
 */
const BCRYPT = require("bcrypt");

/**
 * Models
 */
const User = require("../domain/model/user.model");

/**
 * ACTIONS
 */
function test(request, response) {
  response.status(200).send({
    message: "Testing the user controller and the action test"
  });
}

function saveUser(request, response) {
  // Create the User object
  const user = new User();
  // Get the body response with the body-parser, which converts the response in JSON.
  const PARAMS = request.body;
  // Assign values to the User object.
  if (PARAMS.name && PARAMS.surname && PARAMS.email && PARAMS.password) {
    user.name = PARAMS.name;
    user.surname = PARAMS.surname;
    user.email = PARAMS.email;
    user.role = "ROLE_USER";
    user.image = null;

    // Encrypting the password.
    BCRYPT.hash(PARAMS.password, 3, function(error, hash) {
      user.password = hash;
      // Saving the User object in the DB.
      user.save((error, userStored) => {
        if (error) {
          response.status(500).send({
            message: "Error when trying to save the user"
          });
        } else {
          if (!userStored) {
            response.status(404).send({
              message: "The user is not registered in the DataBase"
            });
          } else {
            response.status(200).send({
              user: userStored
            });
          }
        }
      });
    });
  } else {
    response.status(200).send({
      message: "Introduce properly the User data to be able to register it."
    });
  }
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  test,
  saveUser
};
