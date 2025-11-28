# CineMax Backend - Guia Completo de Desenvolvimento

## 📋 Índice
1. [Visão Geral da Arquitetura](#visão-geral)
2. [Estrutura de Pastas](#estrutura)
3. [Ordem de Desenvolvimento](#ordem)
4. [Detalhamento de Cada Componente](#componentes)
5. [Fluxo de Dados](#fluxo)
6. [Dicas e Boas Práticas](#dicas)

---

## 🏗️ Visão Geral da Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para APIs REST:

```
Cliente (Frontend) 
    ↓
Rotas (Define endpoints)
    ↓
Controllers (Lógica de negócio)
    ↓
Models (Estrutura dos dados)
    ↓
Database (PostgreSQL)
```

---

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/           # Configurações gerais
│   │   └── database.js   # Config do banco de dados
│   ├── database/         # Gerenciamento do banco
│   │   ├── index.js      # Conexão e inicialização
│   │   └── migrations/   # Versionamento do banco
│   ├── models/           # Estrutura das tabelas
│   │   ├── index.js      # Carrega todos os models
│   │   ├── User.js       # Exemplo: Model de usuário
│   │   └── Movie.js      # Exemplo: Model de filme
│   ├── controllers/      # Lógica de negócio
│   │   ├── UserController.js
│   │   └── MovieController.js
│   ├── routes/           # Definição de endpoints
│   │   ├── index.js      # Agrupa todas as rotas
│   │   ├── user.routes.js
│   │   └── movie.routes.js
│   └── app.js            # Configuração do Express
├── .env                  # Variáveis de ambiente
├── .sequelizerc          # Config do Sequelize CLI
└── package.json
```

---

## 🔢 Ordem de Desenvolvimento

### **Fase 1: Fundação (Já feito)**
✅ 1. `.env` - Variáveis de ambiente  
✅ 2. `config/database.js` - Configuração do banco  
✅ 3. `.sequelizerc` - Configuração do Sequelize CLI

### **Fase 2: Conexão com Banco**
🔄 4. `database/index.js` - Estabelecer conexão  
🔄 5. Testar conexão

### **Fase 3: Estrutura de Dados**
📦 6. `models/index.js` - Sistema de carregamento  
📦 7. `models/User.js` - Primeiro model (exemplo)  
📦 8. Criar migrations

### **Fase 4: Lógica de Negócio**
🎮 9. `controllers/UserController.js` - Primeiro controller  
🎮 10. Implementar CRUD básico

### **Fase 5: Rotas e Integração**
🛣️ 11. `routes/user.routes.js` - Rotas específicas  
🛣️ 12. `routes/index.js` - Agregador de rotas  
🛣️ 13. Atualizar `app.js` com as rotas

### **Fase 6: Testes e Refinamento**
✅ 14. Testar endpoints com Postman/Insomnia  
✅ 15. Adicionar validações e tratamento de erros

---

## 🔍 Detalhamento de Cada Componente

### **1. Config/database.js**

**O QUE É:**  
Arquivo de configuração que define como o Sequelize se conecta ao PostgreSQL em diferentes ambientes.

**POR QUE EXISTE:**  
- Separar configurações de desenvolvimento e produção
- Centralizar credenciais do banco
- Facilitar mudanças de ambiente

**LÓGICA:**
```javascript
// Exporta objeto com configurações por ambiente
{
  development: { /* config local */ },
  production: { /* config servidor */ }
}
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - Sem isso, não há conexão com banco.

---

### **2. Database/index.js**

**O QUE É:**  
Arquivo que estabelece a conexão real com o banco de dados e inicializa o Sequelize.

**POR QUE EXISTE:**  
- Criar instância única do Sequelize (Singleton)
- Testar conexão ao iniciar a aplicação
- Carregar todos os models automaticamente

**LÓGICA:**
```javascript
// 1. Importar Sequelize
// 2. Importar configurações do database.js
// 3. Criar instância do Sequelize
// 4. Testar conexão
// 5. Exportar instância para uso em toda aplicação
```

**EXEMPLO DE CÓDIGO:**
```javascript
const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Pega ambiente atual (development ou production)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Cria conexão
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
  }
);

// Testa conexão
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));

module.exports = sequelize;
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - É a ponte entre aplicação e banco.

---

### **3. Models/index.js**

**O QUE É:**  
Sistema automático que carrega todos os models da pasta e os registra no Sequelize.

**POR QUE EXISTE:**  
- Evitar importar cada model manualmente
- Estabelecer relacionamentos entre tabelas
- Centralizar inicialização dos models

**LÓGICA:**
```javascript
// 1. Ler todos os arquivos .js da pasta models
// 2. Para cada arquivo:
//    - Importar o model
//    - Registrar no Sequelize
//    - Guardar em objeto
// 3. Executar associações (relacionamentos)
// 4. Exportar todos os models
```

**EXEMPLO DE CÓDIGO:**
```javascript
const fs = require('fs');
const path = require('path');
const sequelize = require('../database');

const db = {};

// Lê todos os arquivos da pasta models
fs.readdirSync(__dirname)
  .filter(file => {
    return file !== 'index.js' && file.endsWith('.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// Executa associações (se existirem)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
module.exports = db;
```

**IMPORTÂNCIA:** 🟡 IMPORTANTE - Facilita muito a organização.

---

### **4. Models/User.js (Exemplo)**

**O QUE É:**  
Define a estrutura de uma tabela no banco (colunas, tipos, validações).

**POR QUE EXISTE:**  
- Mapear tabelas do banco como objetos JavaScript
- Definir validações de dados
- Facilitar operações CRUD

**LÓGICA:**
```javascript
// 1. Definir nome da tabela
// 2. Definir colunas e tipos
// 3. Definir validações
// 4. Definir relacionamentos (opcional)
// 5. Exportar model
```

**EXEMPLO DE CÓDIGO:**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true  // createdAt, updatedAt
});

module.exports = User;
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - Sem models, não há estrutura de dados.

---

### **5. Controllers/UserController.js (Exemplo)**

**O QUE É:**  
Contém a lógica de negócio para manipular dados (CRUD).

**POR QUE EXISTE:**  
- Separar lógica de negócio das rotas
- Reutilizar código
- Facilitar testes e manutenção

**LÓGICA:**
```javascript
// Cada método = uma operação
// - index: Listar todos
// - show: Buscar um específico
// - store: Criar novo
// - update: Atualizar existente
// - destroy: Deletar
```

**EXEMPLO DE CÓDIGO:**
```javascript
const { User } = require('../models');

class UserController {
  // GET /users - Listar todos
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /users/:id - Buscar um
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST /users - Criar novo
  async store(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PUT /users/:id - Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await user.update(req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /users/:id - Deletar
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - É o cérebro da aplicação.

---

### **6. Routes/user.routes.js (Exemplo)**

**O QUE É:**  
Define os endpoints (URLs) e conecta com os controllers.

**POR QUE EXISTE:**  
- Organizar endpoints por recurso
- Mapear HTTP methods (GET, POST, PUT, DELETE)
- Aplicar middlewares específicos

**LÓGICA:**
```javascript
// 1. Criar router do Express
// 2. Definir rotas e métodos HTTP
// 3. Conectar com controller
// 4. Exportar router
```

**EXEMPLO DE CÓDIGO:**
```javascript
const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

// GET /users - Listar todos
router.get('/', UserController.index);

// GET /users/:id - Buscar um
router.get('/:id', UserController.show);

// POST /users - Criar novo
router.post('/', UserController.store);

// PUT /users/:id - Atualizar
router.put('/:id', UserController.update);

// DELETE /users/:id - Deletar
router.delete('/:id', UserController.destroy);

module.exports = router;
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - Define a API pública.

---

### **7. Routes/index.js**

**O QUE É:**  
Agregador que junta todas as rotas em um único lugar.

**POR QUE EXISTE:**  
- Centralizar todas as rotas
- Adicionar prefixos (ex: /api/v1)
- Facilitar manutenção

**LÓGICA:**
```javascript
// 1. Importar todas as rotas específicas
// 2. Criar router principal
// 3. Registrar cada rota com prefixo
// 4. Exportar router principal
```

**EXEMPLO DE CÓDIGO:**
```javascript
const { Router } = require('express');
const userRoutes = require('./user.routes');
const movieRoutes = require('./movie.routes');

const router = Router();

// Registra rotas com prefixos
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

module.exports = router;
```

**IMPORTÂNCIA:** 🟡 IMPORTANTE - Organiza a estrutura da API.

---

### **8. App.js (Atualizado)**

**O QUE É:**  
Arquivo principal que configura o Express e registra middlewares e rotas.

**POR QUE EXISTE:**  
- Inicializar aplicação Express
- Configurar middlewares globais
- Registrar rotas
- Iniciar servidor

**LÓGICA:**
```javascript
// 1. Carregar variáveis de ambiente
// 2. Criar app Express
// 3. Configurar middlewares
// 4. Registrar rotas
// 5. Iniciar servidor
```

**EXEMPLO DE CÓDIGO:**
```javascript
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
require('./database'); // Inicializa conexão

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'CineMax API is running!',
    version: '1.0.0'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
```

**IMPORTÂNCIA:** 🔴 CRÍTICO - É o coração da aplicação.

---

## 🔄 Fluxo de Dados Completo

### Exemplo: Criar um usuário

```
1. Cliente faz requisição:
   POST http://localhost:8000/api/users
   Body: { "name": "João", "email": "joao@email.com", "password": "123456" }

2. Express recebe e processa:
   app.js → Middleware JSON → routes/index.js

3. Router direciona:
   routes/index.js → /api/users → routes/user.routes.js

4. Rota específica chama controller:
   POST / → UserController.store

5. Controller processa:
   - Valida dados
   - Chama Model User.create()

6. Model interage com banco:
   - Sequelize gera SQL
   - PostgreSQL executa INSERT
   - Retorna dados salvos

7. Resposta volta:
   Model → Controller → Route → Express → Cliente
   Status: 201 Created
   Body: { "id": 1, "name": "João", "email": "joao@email.com" }
```

---

## 💡 Dicas e Boas Práticas

### **Organização**
- ✅ Um arquivo por model/controller/rota
- ✅ Nomes descritivos e consistentes
- ✅ Comentários apenas quando necessário

### **Segurança**
- 🔒 Nunca commitar `.env` no Git
- 🔒 Validar TODOS os inputs
- 🔒 Usar bcrypt para senhas
- 🔒 Implementar autenticação JWT

### **Performance**
- ⚡ Usar índices no banco
- ⚡ Paginar listagens grandes
- ⚡ Cachear dados frequentes

### **Tratamento de Erros**
```javascript
// Sempre usar try-catch
try {
  // código
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
}
```

### **Validações**
```javascript
// No model
validate: {
  isEmail: true,
  len: [3, 100],
  notEmpty: true
}

// No controller
if (!name || !email) {
  return res.status(400).json({ error: 'Missing fields' });
}
```

### **Testes**
- 🧪 Testar cada endpoint no Postman
- 🧪 Verificar status codes corretos
- 🧪 Testar casos de erro

---

## 📝 Checklist de Desenvolvimento

```
□ Fase 1: Fundação
  ✅ .env configurado
  ✅ config/database.js criado
  ✅ .sequelizerc configurado

□ Fase 2: Banco de Dados
  □ database/index.js criado
  □ Conexão testada e funcionando

□ Fase 3: Models
  □ models/index.js criado
  □ Primeiro model criado
  □ Migration executada

□ Fase 4: Controllers
  □ Primeiro controller criado
  □ Métodos CRUD implementados

□ Fase 5: Rotas
  □ Rotas específicas criadas
  □ routes/index.js criado
  □ app.js atualizado

□ Fase 6: Testes
  □ Todos endpoints testados
  □ Erros tratados
  □ Documentação básica feita
```

---

Este README serve como guia completo para desenvolver seu backend. Siga a ordem sugerida e consulte os exemplos quando precisar implementar cada parte! 🚀
