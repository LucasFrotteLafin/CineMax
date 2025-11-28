const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  year: {
    type: DataTypes.INTEGER
  },
  genre: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duração em minutos'
  },
  rating: {
    type: DataTypes.STRING,
    comment: 'L, 10, 12, 14, 16, 18'
  },
  poster: {
    type: DataTypes.STRING,
    comment: 'URL da capa'
  },
  videoUrl: {
    type: DataTypes.STRING,
    comment: 'URL do vídeo para assistir'
  },
  trailer: {
    type: DataTypes.STRING,
    comment: 'URL do trailer'
  }
}, {
  tableName: 'movies',
  timestamps: true
});

module.exports = Movie;
