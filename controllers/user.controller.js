/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Modules
 */
// Used to crypt passwords.
const BCRYPT = require("bcrypt");
// This variable allows us to work with the file library extension of NodeJS.
const FS = require("fs");
// To get acces to file routes within our file directory.
const PATH = require("path");

/**
 * Models
 */
const User = require("../domain/model/user.model");

/**
 * Services
 */
const JWT_SERVICE = require("../services/jwt.service");

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

// The user must be logged in!.
function updateUser(request, response) {
  // The user.id given by parameter.
  const USER_ID = request.params.id;
  // The given data to update the user.
  const TO_UPDATE = request.body;
  let PASSWORD_TO_UPDATE;
  // Checks if the user.id gotten is the same id of the user stored in the DB.
  if (USER_ID != request.user.sub) {
    return response.status(500).send({
      message: "You do not have permission to update the user."
    });
  }
  User.findByIdAndUpdate(
    USER_ID,
    TO_UPDATE,
    { new: true },
    (error, userUpdated) => {
      // In case there is any error when trying to update the user...
      if (error) {
        response.status(500).send({
          message: "Error when updating the user."
        });
      } else {
        // If the user is not updated...
        if (!userUpdated) {
          response.status(404).send({
            message: "The user cannot be updated."
          });
        } else {
          response.status(200).send({
            user: userUpdated
          });
        }
      }
    }
  );
}

function uploadImage(request, response) {
  // The user.id given by parameter.
  const USER_ID = request.params.id;
  let fileName = "Not updated...";
  // Checks if there are files in the given request.
  if (request.files) {
    // This variable gives us the path of the image to upload.
    const FILE_PATH = request.files.image.path;
    // Splits the path into an array of the elementes divided by "\\".
    const FILE_SPLIT = FILE_PATH.split("\\");
    // The entire file name and its extension.
    fileName = FILE_SPLIT[2];
    const EXTENSION_SPLIT = fileName.split(".");
    const FILE_EXTENSION = EXTENSION_SPLIT[1];
    if (
      FILE_EXTENSION == "png" ||
      FILE_EXTENSION == "jpg" ||
      FILE_EXTENSION == "jpeg" ||
      FILE_EXTENSION == "gif"
    ) {
      if (USER_ID != request.user.sub) {
        return response.status(500).send({
          message: "You do not have permission to update the user."
        });
      }
      User.findByIdAndUpdate(
        USER_ID,
        { image: fileName },
        { new: true },
        (error, userUpdated) => {
          // In case there is any error when trying to update the user...
          if (error) {
            response.status(500).send({
              message: "Error when updating the user."
            });
          } else {
            // If the user is not updated...
            if (!userUpdated) {
              response.status(404).send({
                message: "The user cannot be updated."
              });
            } else {
              response.status(200).send({
                user: userUpdated
              });
            }
          }
        }
      );
    } else {
      // Deletes the file in case th extension is not valid.
      FS.unlink(FILE_PATH, error => {
        if (error) {
          response.status(500).send({
            message: "No valid extension and file deleted."
          });
        } else {
          response.status(500).send({
            message: "No valid extension."
          });
        }
      });
    }
  } else {
    response.status(500).send({
      message: "There are no uploaded files."
    });
  }
}

function getImageFile(request, response) {
  // The image file passed by the request parameter.
  const IMAGE_FILE = request.params.imageFile;
  // The folder route of the desired image.
  const PATH_FILE = "./uploads/users/" + IMAGE_FILE;
  // Checks if the file really exists.
  FS.exists(PATH_FILE, function(exists) {
    if (exists) {
      // Sends to file to the as a response.
      response.sendFile(PATH.resolve(PATH_FILE));
    } else {
      response.status(404).send({
        message: "The image does not exist."
      });
    }
  });
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
        // Saves the user in the DB.
        response.status(200).send({
          user: userStored
        });
      }
    }
  });
}

/**
 * TEST FUNCTION TO CHECK THE CONTROLLER
 */
function test(request, response) {
  response.status(200).send({
    message: "Testing the user controller and the test action.",
    user: request.user
  });
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  saveUser,
  login,
  test,
  updateUser,
  uploadImage,
  getImageFile
};
