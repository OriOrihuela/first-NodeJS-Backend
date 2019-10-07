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

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  saveAnimal, getAnimals
};
