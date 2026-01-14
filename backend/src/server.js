require('dotenv').config();
const express = require('express');
const path = require('path');
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


app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
