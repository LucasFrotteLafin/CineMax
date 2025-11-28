const Movie = require('../models/Movie');

class MovieController {
  async index(req, res) {
    try {
      const movies = await Movie.findAll({
        where: { active: true },
        order: [['releaseDate', 'DESC']]
      });
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      return res.json(movie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const movie = await Movie.create(req.body);
      return res.status(201).json(movie);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MovieController();
