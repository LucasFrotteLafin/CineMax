const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

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
    comment: 'Classificação: L, 10, 12, 14, 16, 18'
  },
  poster: {
    type: DataTypes.STRING,
    comment: 'URL da imagem de capa'
  }
}, {
  tableName: 'movies',
  timestamps: true
});

module.exports = Movie;
