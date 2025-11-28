require('dotenv').config();
const express = require('express');
const routes = require('./routes');
require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rotas
app.use('/api', routes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: '🎬 CineMax Streaming API',
    version: '1.0.0',
    endpoints: {
      movies: '/api/movies'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
