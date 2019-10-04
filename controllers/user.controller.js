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
  const USER = new User();
  // Get the body response with the body-parser, which converts the response in JSON.
  const PARAMS = request.body;
  // Assign values to the User object.
  if (PARAMS.name && PARAMS.surname && PARAMS.email && PARAMS.password) {
    USER.name = PARAMS.name;
    USER.surname = PARAMS.surname;
    USER.email = PARAMS.email;
    USER.role = "ROLE_USER";
    USER.image = null;

    User.findOne(
      {
        email: USER.email.toLowerCase()
      },
      (error, user) => {
        if (error) {
          response.status(500).send({
            message: "Error checking the user exists."
          });
        } else {
          if (!user) {
            // Encrypting the password.
            BCRYPT.hash(PARAMS.password, 3, function(error, hash) {
              USER.password = hash;
              // Saving the user object in the DB.
              persistUser(USER, response);
            });
          } else {
            response.status(200).send({
              message: "The user already exists."
            });
          }
        }
      }
    );
  } else {
    response.status(200).send({
      message: "Introduce properly the User data to be able to register it."
    });
  }
}

function persistUser(user, response) {
  user.save((error, userStored) => {
    if (error) {
      response.status(500).send({
        message: "Error when trying to save the user."
      });
    } else {
      if (!userStored) {
        response.status(404).send({
          message: "The user is not registered in the DataBase."
        });
      } else {
        response.status(200).send({
          user: userStored,
          message: "The user has been stored in the DB."
        });
      }
    }
  });
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  test,
  saveUser
};
