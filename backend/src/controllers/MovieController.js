const Movie = require('../models/Movie');

class MovieController {
  // Listar todos os filmes
  async index(req, res) {
    try {
      const movies = await Movie.findAll({
        order: [['year', 'DESC']]
      });
      
      return res.json({
        total: movies.length,
        movies
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar filmes' 
      });
    }
  }

  // Buscar um filme
  async show(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ 
          error: 'Filme não encontrado' 
        });
      }
      
      return res.json(movie);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar filme' 
      });
    }
  }

  // Criar filme (admin)
  async store(req, res) {
    try {
      const movie = await Movie.create(req.body);
      
      return res.status(201).json({
        message: 'Filme adicionado',
        movie
      });
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao criar filme' 
      });
    }
  }
}

module.exports = new MovieController();
