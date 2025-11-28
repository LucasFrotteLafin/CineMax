const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  }
);

// Testar conexão
sequelize.authenticate()
  .then(() => console.log('✅ Banco de dados conectado'))
  .catch(err => console.error('❌ Erro ao conectar:', err.message));

module.exports = sequelize;
