const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Banco conectado'))
  .catch(err => console.error('❌ Erro no banco:', err));

module.exports = sequelize;
