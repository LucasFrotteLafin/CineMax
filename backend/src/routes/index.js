const express = require('express');
const movieRoutes = require('./movieRoutes');

const router = express.Router();

router.use('/movies', movieRoutes);

module.exports = router;
