const { Router } = require('express');
const movieRoutes = require('./movie.routes');

const router = Router();

router.use('/movies', movieRoutes);

module.exports = router;
