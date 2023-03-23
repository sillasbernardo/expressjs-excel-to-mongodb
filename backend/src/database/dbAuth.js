/* --- @imports --- */
const mongoose = require('mongoose');

const ApiError = require('../error/apiError');

/* --- @code --- */

// Extract env variables for mongodb auth
const mongodbAuth = () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST } = process.env;
  mongoose
    .connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}.2b9jexs.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
      return console.log('DB connected');
    })
    .catch((error) => {
      console.error(error);
			throw ApiError.internal('Something went wrong')
    });
};

/* --- @exports --- */
module.exports = mongodbAuth;
