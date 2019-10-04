/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Call the mongoose dependency to extract the schema from the DB.
 */
const MONGOOSE = require("mongoose");
const SCHEMA = MONGOOSE.Schema;

/**
 * Create the MODEL.
 */
const ANIMAL_SCHEMA = SCHEMA(
  {
    name: String,
    description: String,
    year: Number,
    image: String,
    user: {
      type: SCHEMA.ObjectId,
      ref: "User"
    }
  },
  { versionKey: false }
);

module.exports = MONGOOSE.model("Animal", ANIMAL_SCHEMA);
