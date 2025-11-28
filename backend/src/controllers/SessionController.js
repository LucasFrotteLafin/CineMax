const Session = require('../models/Session');
const Movie = require('../models/Movie');
const Room = require('../models/Room');

class SessionController {
  async index(req, res) {
    try {
      const { movieId, date } = req.query;
      const where = { active: true };
      
      if (movieId) where.movieId = movieId;
      if (date) where.sessionDate = date;
      
      const sessions = await Session.findAll({
        where,
        include: [
          { model: Movie, as: 'movie' },
          { model: Room, as: 'room' }
        ],
        order: [['sessionDate', 'ASC'], ['sessionTime', 'ASC']]
      });
      
      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id, {
        include: [
          { model: Movie, as: 'movie' },
          { model: Room, as: 'room' }
        ]
      });
      
      if (!session) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { movieId, roomId, sessionDate, sessionTime, price } = req.body;
      
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      
      const session = await Session.create({
        movieId,
        roomId,
        sessionDate,
        sessionTime,
        price,
        availableSeats: room.capacity
      });
      
      return res.status(201).json(session);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SessionController();
