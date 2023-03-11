var mysql = require("mysql");
var OAuth2Client = require("google-auth-library");
const dbConnection = require("dbConnection.js");

function parseJWT (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

/**
 * Sample Lambda function which mocks the operation of buying a random number of shares for a stock.
 * For demonstration purposes, this Lambda function does not actually perform any  actual transactions. It simply returns a mocked result.
 *
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing details of the stock buying transaction
 *
 */

exports.lambdaHandler = async (event, context) => {
  // ------- Get user from Database -------

  const token = parseJWT(event.pathParameters.token);

  const con = await dbConnection.connectDB(
    process.env.DatabaseAddress,
    "user",
    "Password1234",
    "databaseAmazonianPrime"
  );

  const getUserByEmailQuery = `SELECT * FROM Users WHERE Email = "${token.email}"`;

  var getUser = await new Promise((resolve, reject) => {
    con.query(getUserByEmailQuery, function (err, res) {
      if (err) {
        reject("Couldn't get the user from database!");
      }
      resolve(res);
    });
  });

  if (getUser.length < 1) {
    let firstName = token.given_name;
    let lastName = token.family_name;
    let userEmail = token.email;
    const addUserQuery = `INSERT INTO Users(firstName, lastName, email, isAdmin) VALUES("${firstName}", "${lastName}", "${userEmail}", false)`;

    const addUsers = await new Promise((resolve, reject) => {
      con.query(addUserQuery, function (err, res) {
        if (err) {
          reject("Couldn't add the user to database!");
        }
        resolve(res);
      });
    });

    const insertedId = addUsers["insertId"];

    const getUserByIdQuery = `SELECT * FROM Users WHERE UserID = "${insertedId}"`;
    getUser = await new Promise((resolve, reject) => {
      con.query(getUserByIdQuery, function (err, res) {
        if (err) {
          reject("Couldn't get the user from database!");
        }
        resolve(res);
      });
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getUser[0]),
  };
};
