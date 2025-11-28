const { Router } = require('express');
const MovieController = require('../controllers/MovieController');

const router = Router();

// Listar todos os filmes
router.get('/', MovieController.index);

// Buscar filme específico
router.get('/:id', MovieController.show);

// Adicionar filme
router.post('/', MovieController.store);

module.exports = router;
