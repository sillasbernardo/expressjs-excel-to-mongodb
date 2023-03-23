/* --- @imports --- */
const express = require('express');

const peopleController = require('../controllers/peopleController.js')

/* --- @code --- */
const router = express.Router();

// Get people
router.get('/', peopleController);

/* --- @exports --- */
module.exports = router;