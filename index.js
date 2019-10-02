/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";
const APP = require("./app");
const PORT = process.env.PORT || 1212;

/**
 * Mongoose provides a straight-forward, schema-based solution to model your application data.
 * It includes built-in type casting, validation, query building, business logic hooks and more, out of the box
 *                              ---------
 * Create the mongoose variable to be able to connect to the specified MongoDB database.
 */
const MONGOOSE = require("mongoose");

/**
 * In this sentence, we connect the Mongoose plugin to the selected database.
 * We also provide the connection to the desired port, charged
 */
MONGOOSE.connect(
  "mongodb://localhost:27017/ZOO",
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error, answer) => {
    if (error) {
      throw error;
    } else {
      APP.listen(PORT, () => {
          console.log("El servidor local con Node y Express se ejecuta correctamente.")
      });
    }
  }
);
