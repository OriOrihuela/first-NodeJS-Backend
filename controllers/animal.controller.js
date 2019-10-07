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
function saveAnimal(request, response) {
  // Create the animal object
  const ANIMAL = new Animal();
  // Get the data from the request.
  const PARAMS = request.body;
  // Cheks if the request has the name property.
  if (PARAMS.name) {
    // Apply the request data to the animal object.
    ANIMAL.name = PARAMS.name;
    ANIMAL.description = PARAMS.description;
    ANIMAL.year = PARAMS.year;
    ANIMAL.image = null;
    ANIMAL.user = request.user.sub;
    // Save the animal.
    persistAnimal(ANIMAL, response);
  } else {
    response.status(404).send({
      message: "The animal name is required."
    });
  }
}

function persistAnimal(animal, response) {
  animal.save((error, animalStored) => {
    if (error) {
      response.status(500).send({
        message: "Error in the server."
      });
    } else {
      if (!animalStored) {
        response.status(404).send({
          message: "The animal has not been stored."
        });
      } else {
        // Saves the animal in the DB.
        response.status(200).send({
          animal: animalStored
        });
      }
    }
  });
}

function getAnimals(request, response) {
  /**
   * If the find() parameters is empty, returns the entire collection.
   * The populate parameter makes references to the "user" object id related to the
   * users collection in the DB.
   */
  Animal.find({})
    .populate({ path: "user" })
    .exec((error, animals) => {
      if (error) {
        response.status(500).send({
          message: "Error in the animals request."
        });
      } else {
        if (!animals) {
          response.status(404).send({
            message: "There are no animals in the DB ."
          });
        } else {
          response.status(200).send({
            animals
          });
        }
      }
    });
}

function getAnimal(request, response) {
  // Gets the id of the desired animal.
  const ANIMAL_ID = request.params.id;
  /**
   * Searches the requested animal in the DB.
   * Remember to add .populate({path: "user"}), to reference the user property in the Animal Model.
   */
  Animal.findById(ANIMAL_ID)
    .populate({ path: "user" })
    .exec((error, animal) => {
      if (error) {
        response.status(500).send({
          message: "Error in the animal request."
        });
      } else {
        if (!animal) {
          response.status(404).send({
            message: "The requested animal does not exist."
          });
        } else {
          response.status(200).send({
            animal
          });
        }
      }
    });
}

function updateAnimal(request, response) {
  // Gets the id of the desired animal.
  const ANIMAL_ID = request.params.id;
  // The data to be updated.
  const UPDATE = request.body;
  Animal.findByIdAndUpdate(
    ANIMAL_ID,
    UPDATE,
    { new: true },
    (error, animalUpdated) => {
      if (error) {
        response.status(500).send({
          message: "Error in the update animal request."
        });
      } else {
        if (!animalUpdated) {
          response.status(404).send({
            message: "The animal has not been updated."
          });
        } else {
          response.status(200).send({
            animal: animalUpdated
          });
        }
      }
    }
  );
}

function deleteAnimal(request, response) {
  // The animal.id given by parameter.
  const ANIMAL_ID = request.params.id;

  Animal.findByIdAndRemove(ANIMAL_ID, (error, animalRemoved) => {
    if (error) {
      response.status(500).send({
        message: "Error in the request."
      });
    } else {
      if (!animalRemoved) {
        response.status(404).send({
          message: "The animal cannot be removed."
        });
      } else {
        response.status(500).send({
          animal: animalRemoved
        });
      }
    }
  });
}

function uploadImage(request, response) {
  // The animal.id given by parameter.
  const ANIMAL_ID = request.params.id;
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
      Animal.findByIdAndUpdate(
        ANIMAL_ID,
        { image: fileName },
        { new: true },
        (error, animalUpdated) => {
          // In case there is any error when trying to update the animal...
          if (error) {
            response.status(500).send({
              message: "Error when updating the animal."
            });
          } else {
            // If the animal is not updated...
            if (!animalUpdated) {
              response.status(404).send({
                message: "The animal cannot be updated."
              });
            } else {
              response.status(200).send({
                animal: animalUpdated
              });
            }
          }
        }
      );
    } else {
      // Deletes the file in case the extension is not valid.
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
  const PATH_FILE = "./uploads/animals/" + IMAGE_FILE;
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

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal
};
