const { Router } = require('express');
const movieRoutes = require('./movie.routes');
const sessionRoutes = require('./session.routes');

const router = Router();

router.use('/movies', movieRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;
