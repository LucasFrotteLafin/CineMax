# Setup Inicial - CineMax Backend

## ✅ O que já está pronto (1/3 do projeto)

### **Estrutura criada:**
```
backend/
├── src/
│   ├── config/
│   │   └── database.js ✅
│   ├── database/
│   │   └── index.js ✅
│   ├── models/
│   │   ├── Movie.js ✅
│   │   ├── Room.js ✅
│   │   └── Session.js ✅
│   ├── controllers/
│   │   ├── MovieController.js ✅
│   │   └── SessionController.js ✅
│   ├── routes/
│   │   ├── index.js ✅
│   │   ├── movie.routes.js ✅
│   │   └── session.routes.js ✅
│   └── app.js ✅
├── .env ✅
└── package.json ✅
```

---

## 🚀 Como iniciar

### **1. Criar banco de dados no PostgreSQL**

Abra o pgAdmin ou terminal do PostgreSQL:

```sql
CREATE DATABASE cinemax_dev;
```

### **2. Sincronizar tabelas**

Crie um arquivo temporário para sincronizar:

**`sync.js`** (na raiz do backend):
```javascript
require('dotenv').config();
const sequelize = require('./src/database');
require('./src/models/Movie');
require('./src/models/Room');
require('./src/models/Session');

sequelize.sync({ force: true })
  .then(() => {
    console.log('✅ Tabelas criadas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
```

Execute:
```bash
node sync.js
```

### **3. Popular banco com dados de teste**

**`seed.js`** (na raiz do backend):
```javascript
require('dotenv').config();
const Movie = require('./src/models/Movie');
const Room = require('./src/models/Room');
const Session = require('./src/models/Session');

async function seed() {
  try {
    // Criar filmes
    const movie1 = await Movie.create({
      title: 'Oppenheimer',
      description: 'A história de J. Robert Oppenheimer e a criação da bomba atômica.',
      duration: 180,
      genre: 'Drama',
      rating: '14',
      director: 'Christopher Nolan',
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      releaseDate: '2023-07-20',
      active: true
    });

    const movie2 = await Movie.create({
      title: 'Barbie',
      description: 'Barbie vive em Barbieland, mas decide explorar o mundo real.',
      duration: 114,
      genre: 'Comédia',
      rating: 'L',
      director: 'Greta Gerwig',
      poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
      releaseDate: '2023-07-20',
      active: true
    });

    // Criar salas
    const room1 = await Room.create({
      name: 'Sala 1',
      capacity: 100,
      type: '2D',
      active: true
    });

    const room2 = await Room.create({
      name: 'Sala IMAX',
      capacity: 150,
      type: 'IMAX',
      active: true
    });

    // Criar sessões
    await Session.create({
      movieId: movie1.id,
      roomId: room2.id,
      sessionDate: '2025-11-28',
      sessionTime: '14:00:00',
      price: 35.00,
      availableSeats: 150
    });

    await Session.create({
      movieId: movie1.id,
      roomId: room2.id,
      sessionDate: '2025-11-28',
      sessionTime: '19:00:00',
      price: 40.00,
      availableSeats: 150
    });

    await Session.create({
      movieId: movie2.id,
      roomId: room1.id,
      sessionDate: '2025-11-28',
      sessionTime: '15:30:00',
      price: 25.00,
      availableSeats: 100
    });

    await Session.create({
      movieId: movie2.id,
      roomId: room1.id,
      sessionDate: '2025-11-28',
      sessionTime: '20:00:00',
      price: 30.00,
      availableSeats: 100
    });

    console.log('✅ Dados inseridos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seed();
```

Execute:
```bash
node seed.js
```

### **4. Iniciar servidor**

```bash
npm run dev
```

---

## 📡 Endpoints disponíveis para o Frontend

### **Filmes**

**Listar todos os filmes:**
```
GET http://localhost:8000/api/movies
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Oppenheimer",
    "description": "A história de J. Robert Oppenheimer...",
    "duration": 180,
    "genre": "Drama",
    "rating": "14",
    "director": "Christopher Nolan",
    "poster": "https://...",
    "releaseDate": "2023-07-20",
    "active": true
  }
]
```

**Buscar filme específico:**
```
GET http://localhost:8000/api/movies/1
```

**Criar novo filme:**
```
POST http://localhost:8000/api/movies
Content-Type: application/json

{
  "title": "Duna: Parte 2",
  "description": "Paul Atreides se une a Chani...",
  "duration": 166,
  "genre": "Ficção Científica",
  "rating": "12",
  "director": "Denis Villeneuve",
  "poster": "https://...",
  "releaseDate": "2024-03-01"
}
```

---

### **Sessões**

**Listar todas as sessões:**
```
GET http://localhost:8000/api/sessions
```

**Resposta:**
```json
[
  {
    "id": 1,
    "movieId": 1,
    "roomId": 2,
    "sessionDate": "2025-11-28",
    "sessionTime": "14:00:00",
    "price": "35.00",
    "availableSeats": 150,
    "active": true,
    "movie": {
      "id": 1,
      "title": "Oppenheimer",
      "poster": "https://..."
    },
    "room": {
      "id": 2,
      "name": "Sala IMAX",
      "type": "IMAX"
    }
  }
]
```

**Filtrar sessões por filme:**
```
GET http://localhost:8000/api/sessions?movieId=1
```

**Filtrar sessões por data:**
```
GET http://localhost:8000/api/sessions?date=2025-11-28
```

**Filtrar por filme E data:**
```
GET http://localhost:8000/api/sessions?movieId=1&date=2025-11-28
```

**Buscar sessão específica:**
```
GET http://localhost:8000/api/sessions/1
```

**Criar nova sessão:**
```
POST http://localhost:8000/api/sessions
Content-Type: application/json

{
  "movieId": 1,
  "roomId": 2,
  "sessionDate": "2025-11-29",
  "sessionTime": "16:00:00",
  "price": 35.00
}
```

---

## 🎨 Exemplos para o Frontend

### **React - Listar filmes**

```javascript
import { useEffect, useState } from 'react';

function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>
          <img src={movie.poster} alt={movie.title} />
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <p>Duração: {movie.duration} min</p>
          <p>Gênero: {movie.genre}</p>
        </div>
      ))}
    </div>
  );
}
```

### **React - Listar sessões de um filme**

```javascript
import { useEffect, useState } from 'react';

function Sessions({ movieId }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/sessions?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => setSessions(data));
  }, [movieId]);

  return (
    <div>
      <h3>Sessões disponíveis:</h3>
      {sessions.map(session => (
        <div key={session.id}>
          <p>Data: {session.sessionDate}</p>
          <p>Horário: {session.sessionTime}</p>
          <p>Sala: {session.room.name} ({session.room.type})</p>
          <p>Preço: R$ {session.price}</p>
          <p>Assentos: {session.availableSeats}</p>
          <button>Comprar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist para o Frontend começar

```
✅ API rodando em http://localhost:8000
✅ Endpoint de filmes funcionando
✅ Endpoint de sessões funcionando
✅ CORS configurado
✅ Dados de teste no banco
```

---

## 🔜 Próximos passos (2/3 restantes)

**Você vai implementar depois:**
- Models: Seat, Ticket, Payment
- Controllers: SeatController, TicketController, PaymentController
- Services: EmailService, SmsService, PaymentValidation
- Utils: Validators (regex de cartão)
- Rotas: seat.routes, ticket.routes, payment.routes

**Mas o frontend já pode começar com:**
- Listagem de filmes
- Seleção de filme
- Visualização de sessões
- Interface de seleção de horário

---

## 🐛 Troubleshooting

**Erro de conexão com banco:**
- Verifique se PostgreSQL está rodando
- Confira credenciais no `.env`
- Teste conexão: `node -e "require('./src/database')"`

**Porta 8000 em uso:**
- Mate o processo: `taskkill /F /IM node.exe`
- Ou mude a porta no `.env`

**CORS error no frontend:**
- Já está configurado no `app.js`
- Se persistir, instale: `npm install cors`

---

Agora o frontend pode começar a trabalhar! 🚀
