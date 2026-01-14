require('dotenv').config();
const express = require('express');
const routes = require('./routes');
require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: '🎬 CineMax API', status: 'online' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
