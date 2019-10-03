/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

function test(request, response) {
  response.status(200).send({
    message: "Testing the user controller and the action test"
  });
}

/**
 * It is needed to export the functions to be able to use them.
 */
module.exports = {
  test
};
