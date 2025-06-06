const utilities = require("../utilities"); // To get nav if needed in view

const throwError = (req, res, next) => {
  try {
    // Simulate an internal server error
    throw new Error("Intentional Server Crash");
  } catch (err) {
    next(err); // Send error to the error-handling middleware
  }
};

module.exports = { throwError };
