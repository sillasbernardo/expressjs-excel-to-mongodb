/* --- @imports --- */
const express = require('express');

const peopleRoutes = require('./people/routes/peopleRoutes');

/* --- @code --- */
const router = express.Router();

// Redirect to people routes
router.use('/api/people', peopleRoutes);

/* --- @exports --- */
module.exports = router;