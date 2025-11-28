const { Router } = require('express');
const MovieController = require('../controllers/MovieController');

const router = Router();

router.get('/', MovieController.index);
router.get('/:id', MovieController.show);
router.post('/', MovieController.store);

module.exports = router;
