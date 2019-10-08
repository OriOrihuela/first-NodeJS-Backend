/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities.
 */
"use strict";

/**
 * Actions
 */
function isAdmin(request, response, next) {
  if (request.user.role != "ROLE_ADMIN") {
    return response.status(500).send({
      message: "You do not have access to this area."
    });
  }
  next();
}

module.exports = {
  isAdmin
};
