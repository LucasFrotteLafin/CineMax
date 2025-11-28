const { Router } = require('express');
const SessionController = require('../controllers/SessionController');

const router = Router();

router.get('/', SessionController.index);
router.get('/:id', SessionController.show);
router.post('/', SessionController.store);

module.exports = router;
