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

  // DELETE /api/movies/:id - Deletar filme
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({
          success: false,
          error: 'Filme não encontrado'
        });
      }
      
      await movie.destroy();
      
      return res.json({
        success: true,
        message: 'Filme deletado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao deletar filme'
      });
    }
  }

  // POST /api/movies - Criar filme
  async store(req, res) {
    try {
      const { title, description, year, genre, duration, ageRating, poster } = req.body;
      
      // Validar campos obrigatórios
      if (!title || !description || !year || !genre || !duration || !ageRating || !poster) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: title, description, year, genre, duration, ageRating, poster'
        });
      }
      
      // Validar ageRating
      const validRatings = ['L', '10', '12', '14', '16', '18'];
      if (!validRatings.includes(ageRating)) {
        return res.status(400).json({
          success: false,
          error: 'ageRating deve ser: L, 10, 12, 14, 16 ou 18'
        });
      }
      
      const movie = await Movie.create({
        title,
        description,
        year,
        genre,
        duration,
        ageRating,
        poster
      });
      
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
