# CineMax Backend - Guia de Desenvolvimento

## 📋 Índice
1. [Visão Geral do Sistema](#visão-geral)
2. [Estrutura de Pastas](#estrutura)
3. [Ordem de Desenvolvimento](#ordem)
4. [Models do CineMax](#models)
5. [Controllers do CineMax](#controllers)
6. [Rotas do CineMax](#rotas)
7. [Fluxo de Dados](#fluxo)

---

## 🎬 Visão Geral do Sistema

O CineMax é um sistema de venda de ingressos online com:

- **Filmes**: Catálogo de filmes em cartaz
- **Salas**: Salas de cinema com mapa de assentos
- **Sessões**: Horários de exibição dos filmes
- **Assentos**: Seleção individual de assentos
- **Ingressos**: Compra com diferentes tipos (inteira/meia/estudante)
- **Pagamento**: Processamento de cartão de crédito/débito
- **Notificações**: Envio de ingressos por email/SMS

```
Cliente
    ↓
API REST (Express)
    ↓
Controllers (Lógica)
    ↓
Models (Dados)
    ↓
PostgreSQL
```

---

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   ├── index.js
│   │   └── migrations/
│   ├── models/
│   │   ├── index.js
│   │   ├── Movie.js
│   │   ├── Room.js
│   │   ├── Session.js
│   │   ├── Seat.js
│   │   ├── Ticket.js
│   │   └── Payment.js
│   ├── controllers/
│   │   ├── MovieController.js
│   │   ├── SessionController.js
│   │   ├── SeatController.js
│   │   ├── TicketController.js
│   │   └── PaymentController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── movie.routes.js
│   │   ├── session.routes.js
│   │   ├── seat.routes.js
│   │   ├── ticket.routes.js
│   │   └── payment.routes.js
│   ├── services/
│   │   ├── EmailService.js
│   │   ├── SmsService.js
│   │   └── PaymentValidation.js
│   ├── utils/
│   │   └── validators.js
│   └── app.js
├── .env
├── .sequelizerc
└── package.json
```

---

## 🔢 Ordem de Desenvolvimento

### **Fase 1: Fundação** ✅
1. `.env`
2. `config/database.js`
3. `.sequelizerc`

### **Fase 2: Conexão**
4. `database/index.js`
5. Testar conexão

### **Fase 3: Models**
6. `models/index.js`
7. `models/Movie.js` (Filmes)
8. `models/Room.js` (Salas)
9. `models/Session.js` (Sessões)
10. `models/Seat.js` (Assentos)
11. `models/Ticket.js` (Ingressos)
12. `models/Payment.js` (Pagamentos)

### **Fase 4: Services e Utils**
13. `utils/validators.js` (Validações de cartão)
14. `services/EmailService.js`
15. `services/SmsService.js`

### **Fase 5: Controllers**
16. `MovieController.js`
17. `SessionController.js`
18. `SeatController.js`
19. `TicketController.js`
20. `PaymentController.js`

### **Fase 6: Rotas**
21. Criar rotas específicas
22. `routes/index.js`
23. Atualizar `app.js`

---

## 🎬 Models do CineMax

### **1. Movie.js (Filmes)**

**O QUE ARMAZENA:**
- Título do filme
- Descrição/sinopse
- Duração (em minutos)
- Gênero
- Classificação etária
- Diretor
- Poster (URL da imagem)

**EXEMPLO DE CÓDIGO:**
```javascript
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
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
    comment: 'Classificação: L, 10, 12, 14, 16, 18'
  },
  director: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  poster: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL da imagem do poster'
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
```

---

### **2. Room.js (Salas)**

**O QUE ARMAZENA:**
- Nome/número da sala
- Capacidade total
- Tipo (2D, 3D, IMAX, VIP)
- Status (ativa/inativa)

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Ex: Sala 1, Sala VIP'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  type: {
    type: DataTypes.ENUM('2D', '3D', 'IMAX', 'VIP'),
    defaultValue: '2D'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'rooms',
  timestamps: true
});

module.exports = Room;
```

---

### **3. Session.js (Sessões)**

**O QUE ARMAZENA:**
- Filme exibido
- Sala utilizada
- Data e hora da sessão
- Preço do ingresso
- Assentos disponíveis

**RELACIONAMENTOS:**
- Pertence a um Filme (belongsTo Movie)
- Pertence a uma Sala (belongsTo Room)
- Tem muitos Ingressos (hasMany Tickets)

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'movies',
      key: 'id'
    }
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id'
    }
  },
  sessionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sessionTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

// Relacionamentos
Session.associate = (models) => {
  Session.belongsTo(models.Movie, {
    foreignKey: 'movieId',
    as: 'movie'
  });
  
  Session.belongsTo(models.Room, {
    foreignKey: 'roomId',
    as: 'room'
  });
  
  Session.hasMany(models.Ticket, {
    foreignKey: 'sessionId',
    as: 'tickets'
  });
};

module.exports = Session;
```

---

### **4. Seat.js (Assentos)**

**O QUE ARMAZENA:**
- Sala do assento
- Número/código do assento (A1, B5, etc)
- Linha e coluna
- Tipo (normal/VIP/acessível)
- Status por sessão

**RELACIONAMENTOS:**
- Pertence a uma Sala (belongsTo Room)
- Tem muitos Ingressos (hasMany Tickets)

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sessions',
      key: 'id'
    }
  },
  seatNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Ex: A1, B5, C10'
  },
  ticketType: {
    type: DataTypes.ENUM('inteira', 'meia'),
    defaultValue: 'inteira'
  },
  customerName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.ENUM('reservado', 'pago', 'cancelado'),
    defaultValue: 'reservado'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'tickets',
  timestamps: true
});

// Relacionamentos
Ticket.associate = (models) => {
  Ticket.belongsTo(models.Session, {
    foreignKey: 'sessionId',
    as: 'session'
  });
};

module.exports = Ticket;
```

---

## 🎮 Controllers do CineMax

### **1. MovieController.js**

**OPERAÇÕES:**
- Listar todos os filmes
- Buscar filme por ID
- Criar novo filme
- Atualizar filme
- Deletar filme
- Listar filmes em cartaz (ativos)

**EXEMPLO DE CÓDIGO:**
```javascript
const { Movie } = require('../models');

class MovieController {
  // GET /movies - Listar todos
  async index(req, res) {
    try {
      const movies = await Movie.findAll({
        where: { active: true },
        order: [['releaseDate', 'DESC']]
      });
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /movies/:id - Buscar um
  async show(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      return res.json(movie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST /movies - Criar novo
  async store(req, res) {
    try {
      const movie = await Movie.create(req.body);
      return res.status(201).json(movie);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PUT /movies/:id - Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      await movie.update(req.body);
      return res.json(movie);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /movies/:id - Deletar (soft delete)
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      await movie.update({ active: false });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MovieController();
```

---

### **2. SessionController.js**

**OPERAÇÕES:**
- Listar sessões (com filtros por filme, data, sala)
- Buscar sessão por ID (com detalhes do filme e sala)
- Criar nova sessão
- Atualizar sessão
- Cancelar sessão
- Verificar disponibilidade de assentos

**EXEMPLO DE CÓDIGO:**
```javascript
const { Session, Movie, Room } = require('../models');
const { Op } = require('sequelize');

class SessionController {
  // GET /sessions - Listar com filtros
  async index(req, res) {
    try {
      const { movieId, date, roomId } = req.query;
      const where = { active: true };
      
      if (movieId) where.movieId = movieId;
      if (date) where.sessionDate = date;
      if (roomId) where.roomId = roomId;
      
      const sessions = await Session.findAll({
        where,
        include: [
          { model: Movie, as: 'movie' },
          { model: Room, as: 'room' }
        ],
        order: [['sessionDate', 'ASC'], ['sessionTime', 'ASC']]
      });
      
      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /sessions/:id - Buscar uma
  async show(req, res) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id, {
        include: [
          { model: Movie, as: 'movie' },
          { model: Room, as: 'room' }
        ]
      });
      
      if (!session) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST /sessions - Criar nova
  async store(req, res) {
    try {
      const { movieId, roomId, sessionDate, sessionTime, price } = req.body;
      
      // Buscar capacidade da sala
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
      
      const session = await Session.create({
        movieId,
        roomId,
        sessionDate,
        sessionTime,
        price,
        availableSeats: room.capacity
      });
      
      return res.status(201).json(session);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PUT /sessions/:id - Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      
      if (!session) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      await session.update(req.body);
      return res.json(session);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /sessions/:id - Cancelar
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      
      if (!session) {
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      await session.update({ active: false });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SessionController();
```

---

### **3. TicketController.js**

**OPERAÇÕES:**
- Listar ingressos
- Buscar ingresso por ID
- Criar ingresso (vender/reservar)
- Atualizar status do ingresso
- Cancelar ingresso

**LÓGICA IMPORTANTE:**
- Verificar disponibilidade de assentos
- Atualizar assentos disponíveis na sessão
- Calcular preço (inteira/meia)

**EXEMPLO DE CÓDIGO:**
```javascript
const { Ticket, Session } = require('../models');
const sequelize = require('../database');

class TicketController {
  // POST /tickets - Criar ingresso
  async store(req, res) {
    const t = await sequelize.transaction();
    
    try {
      const { sessionId, seatNumber, ticketType, customerName, customerEmail } = req.body;
      
      // Buscar sessão
      const session = await Session.findByPk(sessionId, { transaction: t });
      
      if (!session) {
        await t.rollback();
        return res.status(404).json({ error: 'Sessão não encontrada' });
      }
      
      // Verificar disponibilidade
      if (session.availableSeats <= 0) {
        await t.rollback();
        return res.status(400).json({ error: 'Sessão esgotada' });
      }
      
      // Verificar se assento já está ocupado
      const existingTicket = await Ticket.findOne({
        where: {
          sessionId,
          seatNumber,
          status: ['reservado', 'pago']
        },
        transaction: t
      });
      
      if (existingTicket) {
        await t.rollback();
        return res.status(400).json({ error: 'Assento já ocupado' });
      }
      
      // Calcular preço
      const totalPrice = ticketType === 'meia' 
        ? session.price / 2 
        : session.price;
      
      // Criar ingresso
      const ticket = await Ticket.create({
        sessionId,
        seatNumber,
        ticketType,
        customerName,
        customerEmail,
        totalPrice,
        status: 'reservado'
      }, { transaction: t });
      
      // Atualizar assentos disponíveis
      await session.update({
        availableSeats: session.availableSeats - 1
      }, { transaction: t });
      
      await t.commit();
      return res.status(201).json(ticket);
      
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /tickets - Listar ingressos
  async index(req, res) {
    try {
      const { sessionId } = req.query;
      const where = {};
      
      if (sessionId) where.sessionId = sessionId;
      
      const tickets = await Ticket.findAll({
        where,
        include: [{ model: Session, as: 'session' }]
      });
      
      return res.json(tickets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH /tickets/:id/confirm - Confirmar pagamento
  async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findByPk(id);
      
      if (!ticket) {
        return res.status(404).json({ error: 'Ingresso não encontrado' });
      }
      
      await ticket.update({ status: 'pago' });
      return res.json(ticket);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /tickets/:id - Cancelar ingresso
  async destroy(req, res) {
    const t = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const ticket = await Ticket.findByPk(id, { transaction: t });
      
      if (!ticket) {
        await t.rollback();
        return res.status(404).json({ error: 'Ingresso não encontrado' });
      }
      
      // Atualizar status
      await ticket.update({ status: 'cancelado' }, { transaction: t });
      
      // Devolver assento
      const session = await Session.findByPk(ticket.sessionId, { transaction: t });
      await session.update({
        availableSeats: session.availableSeats + 1
      }, { transaction: t });
      
      await t.commit();
      return res.status(204).send();
      
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TicketController();
```

---

## 🛣️ Rotas do CineMax

### **routes/index.js**

```javascript
const { Router } = require('express');
const movieRoutes = require('./movie.routes');
const roomRoutes = require('./room.routes');
const sessionRoutes = require('./session.routes');
const ticketRoutes = require('./ticket.routes');

const router = Router();

router.use('/movies', movieRoutes);
router.use('/rooms', roomRoutes);
router.use('/sessions', sessionRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
```

### **routes/movie.routes.js**

```javascript
const { Router } = require('express');
const MovieController = require('../controllers/MovieController');

const router = Router();

router.get('/', MovieController.index);
router.get('/:id', MovieController.show);
router.post('/', MovieController.store);
router.put('/:id', MovieController.update);
router.delete('/:id', MovieController.destroy);

module.exports = router;
```

### **routes/session.routes.js**

```javascript
const { Router } = require('express');
const SessionController = require('../controllers/SessionController');

const router = Router();

router.get('/', SessionController.index);
router.get('/:id', SessionController.show);
router.post('/', SessionController.store);
router.put('/:id', SessionController.update);
router.delete('/:id', SessionController.destroy);

module.exports = router;
```

### **routes/ticket.routes.js**

```javascript
const { Router } = require('express');
const TicketController = require('../controllers/TicketController');

const router = Router();

router.get('/', TicketController.index);
router.post('/', TicketController.store);
router.patch('/:id/confirm', TicketController.confirmPayment);
router.delete('/:id', TicketController.destroy);

module.exports = router;
```

---

## 🔄 Fluxo de Dados - Exemplo Completo

### **Cenário: Cliente comprando ingresso**

```
1. Cliente consulta filmes em cartaz
   GET /api/movies
   → MovieController.index
   → Retorna lista de filmes ativos

2. Cliente escolhe filme e consulta sessões
   GET /api/sessions?movieId=1&date=2025-11-28
   → SessionController.index
   → Retorna sessões disponíveis com detalhes

3. Cliente escolhe sessão e verifica assentos
   GET /api/sessions/5
   → SessionController.show
   → Retorna sessão com availableSeats

4. Cliente compra ingresso
   POST /api/tickets
   Body: {
     sessionId: 5,
     seatNumber: "A10",
     ticketType: "meia",
     customerName: "João Silva",
     customerEmail: "joao@email.com"
   }
   → TicketController.store
   → Verifica disponibilidade
   → Cria ingresso
   → Atualiza assentos disponíveis
   → Retorna ingresso criado

5. Cliente confirma pagamento
   PATCH /api/tickets/1/confirm
   → TicketController.confirmPayment
   → Atualiza status para "pago"
```

---

## 📝 Checklist de Desenvolvimento

```
□ Fase 1: Fundação
  ✅ .env
  ✅ config/database.js
  ✅ .sequelizerc

□ Fase 2: Banco
  □ database/index.js
  □ Testar conexão

□ Fase 3: Models
  □ models/index.js
  □ Movie.js
  □ Room.js
  □ Session.js
  □ Ticket.js
  □ Testar relacionamentos

□ Fase 4: Controllers
  □ MovieController.js
  □ RoomController.js
  □ SessionController.js
  □ TicketController.js

□ Fase 5: Rotas
  □ movie.routes.js
  □ room.routes.js
  □ session.routes.js
  □ ticket.routes.js
  □ routes/index.js
  □ Atualizar app.js

□ Fase 6: Testes
  □ Testar CRUD de filmes
  □ Testar CRUD de salas
  □ Testar criação de sessões
  □ Testar venda de ingressos
  □ Testar cancelamento
```

---

## 🎯 Endpoints da API

```
Filmes:
GET    /api/movies          - Listar filmes
GET    /api/movies/:id      - Buscar filme
POST   /api/movies          - Criar filme
PUT    /api/movies/:id      - Atualizar filme
DELETE /api/movies/:id      - Deletar filme

Salas:
GET    /api/rooms           - Listar salas
GET    /api/rooms/:id       - Buscar sala
POST   /api/rooms           - Criar sala
PUT    /api/rooms/:id       - Atualizar sala
DELETE /api/rooms/:id       - Deletar sala

Sessões:
GET    /api/sessions        - Listar sessões (com filtros)
GET    /api/sessions/:id    - Buscar sessão
POST   /api/sessions        - Criar sessão
PUT    /api/sessions/:id    - Atualizar sessão
DELETE /api/sessions/:id    - Cancelar sessão

Ingressos:
GET    /api/tickets         - Listar ingressos
POST   /api/tickets         - Comprar ingresso
PATCH  /api/tickets/:id/confirm - Confirmar pagamento
DELETE /api/tickets/:id     - Cancelar ingresso
```

---

Siga este guia para desenvolver o sistema CineMax completo! 🎬🍿
