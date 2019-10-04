/**
 * The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
 * With strict mode, you can not, for example, use undeclared variables.
 * It also serves to use new JS functionalities
 */
"use strict";

/**
 * Load the JWT module.
 * Load the Moment module, to be able to generate timestamps and dates.
 */
const JWT = require("jwt-simple");
const MOMENT = require("moment");

/**
 * This key is added to the token, and it is generated in the jwt.service.js.
 * So nobody will be able to generate the token even if has the same data in the PAYLOAD object.
 * Now, we need it to use the middleware properly and to check the token just before every HTTP request.
 */
const SECRET_KEY = "ori_orihuela_secret_key";

/**
 * Actions
 * - next => refers to the next action that has to be executed after the Middleware does its work, not pausing the HTTP request.
 */
function ensureAuth(request, response, next) {
  // Check if the header has the auth header.
  if (!request.headers.authorization) {
    return response.status(403).send({
      message: "The request does not have an auth header."
    });
  }
  // The replace is to remove the single or double quotes that we are looking for in the header.
  const TOKEN = request.headers.authorization.replace(/['"]+/g, "");

  let PAYLOAD = null;
  try {
    // Checks if the token is valid or not. If it is, then the verification will succeed.
    PAYLOAD = JWT.decode(TOKEN, SECRET_KEY);
    // Checks if the PAYLOAD.exp (expirationDate) is valid.
    if (PAYLOAD.exp <= MOMENT().unix()) {
      return response.status(401).send({
        message: "The token has expirated."
      });
    }
  } catch (error) {
    return response.status(401).send({
      message: "The token is not valid."
    });
  }
  /**
   * We will set a new property within the request to be able to use it everywhere.
   * This property allow us to use itself within all the methods in the controllers.
   * Now, in every action of the controllers, we can get access to the logged user identified by the token.
   */
  request.user = PAYLOAD;
  // Pass to the next method of the route.
  next();
}

module.exports = {
  ensureAuth
};
