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
 * Services
 */
const JWT_SERVICE = require("../services/jwt");

/**
 * ACTIONS
 */
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
      (error, isSetUser) => {
        if (error) {
          response.status(500).send({
            message: "Error checking the user exists."
          });
        } else {
          if (!isSetUser) {
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

function login(request, response) {
  const PARAMS = request.body;
  const EMAIL = PARAMS.email;
  const PASSWORD = PARAMS.password;

  // Looking if the user already exists.
  User.findOne(
    {
      email: EMAIL.toLowerCase()
    },
    (error, user) => {
      if (error) {
        response.status(500).send({
          message: "Error checking if the user exists."
        });
      } else {
        if (user) {
          // Here the password is checked. In case it is the same, the function wiill return the user.
          BCRYPT.compare(PASSWORD, user.password, (error, check) => {
            if (check) {
              // Checking if there is any token for the desired user. If not, generate one.
              if (PARAMS.getToken) {
                // Return the JWT Token.
                response.status(200).send({
                  token: JWT_SERVICE.createToken(user)
                });
              } else {
                response.status(200).send({
                  user
                });
              }
            } else {
              response.status(404).send({
                message: "The user password is not correct."
              });
            }
          });
          // In case the user is not in the registered in the Database, the function will throw an error.
        } else {
          response.status(404).send({
            message: "The user could not login."
          });
        }
      }
    }
  );
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
          user: userStored
        });
      }
    }
  });
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  saveUser,
  login
};
