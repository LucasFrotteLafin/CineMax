require('dotenv').config();
const express = require('express');
const routes = require('./routes');
require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'CineMax API is running!',
    version: '1.0.0',
    endpoints: {
      movies: '/api/movies',
      sessions: '/api/sessions'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;