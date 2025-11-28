const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Movie = require('./Movie');
const Room = require('./Room');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'movies',
      key: 'id'
    }
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id'
    }
  },
  sessionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sessionTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

// Relacionamentos
Session.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });
Session.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

module.exports = Session;
