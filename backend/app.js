/* --- @imports --- */
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

const apiErrorHandler = require('./src/error/apiErrorHandler');
const mongodbAuth = require('./src/database/dbAuth');
const routes = require('./src/routes');

/* --- @code --- */
const app = express();

// Enable cors
app.use(
  cors({
		methods: ['GET'],
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // Prevent issues with 204 on internet explorer
  })
);

// Routes
app.use('/', routes)

// Handles errors from any js file
app.use(apiErrorHandler);

const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Try connecting to mongoDB Atlas
  mongodbAuth();
});
