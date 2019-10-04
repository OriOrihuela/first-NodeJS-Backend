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
 * This key is added to the token, and it is generated here.
 * So nobody will be able to generate the token even if has the same data in the PAYLOAD object.
 */
const SECRET_KEY = "ori_orihuela_secret_key";

// ACTIONS
function createToken(user) {
  // It is needed a payload object which JWT will interact with.
  const PAYLOAD = {
    // sub => property that identifes the user.id within JWT.
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    /** iat, exp => creation and expiration token date.
     * The expiration date can be custom, it means that you can set the lapse of time for the expiration.
     */
    iat: MOMENT().unix(),
    exp: MOMENT()
      .add(30, "days")
      .unix()
  };
  // The token is created with the PAYLOAD data and the SECRET key.
  return JWT.encode(PAYLOAD, SECRET_KEY);
}

module.exports = {
  createToken
};
