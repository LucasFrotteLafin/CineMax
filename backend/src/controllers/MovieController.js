const Movie = require('../models/Movie');

class MovieController {
  // GET /api/movies - Listar todos os filmes
  async index(req, res) {
    try {
      const { genre } = req.query;
      
      const where = {};
      if (genre) where.genre = genre;
      
      const movies = await Movie.findAll({
        where,
        order: [['year', 'DESC']]
      });
      
      return res.json({
        success: true,
        total: movies.length,
        data: movies
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar filmes' 
      });
    }
  }

  // GET /api/movies/:id - Buscar um filme
  async show(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ 
          success: false,
          error: 'Filme não encontrado' 
        });
      }
      
      return res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar filme' 
      });
    }
  }

  // POST /api/movies - Criar filme
  async store(req, res) {
    try {
      const movie = await Movie.create(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Filme criado com sucesso',
        data: movie
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Erro ao criar filme' 
      });
    }
  }
}

module.exports = new MovieController();
