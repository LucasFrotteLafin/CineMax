const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duração em minutos'
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  rating: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'L, 10, 12, 14, 16, 18'
  },
  director: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  poster: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL da imagem'
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'movies',
  timestamps: true
});

module.exports = Movie;
