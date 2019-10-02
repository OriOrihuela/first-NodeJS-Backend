/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Call the mongoose module to extract the schema from the DB.
 */
const MONGOOSE = require("require");
const SCHEMA = MONGOOSE.SCHEMA;

/**
 * Create the MODEL.
 */
const USER_SCHEMA = SCHEMA({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String
});

module.exports = MONGOOSE.model("User", USER_SCHEMA);
