# 🎬 CineMax Streaming - Guia Iniciante

## 📋 O QUE É O PROJETO

Um site de streaming de filmes tipo Netflix, onde você pode:
- Ver catálogo de filmes
- Clicar em um filme e assistir
- Ver detalhes (sinopse, ano, gênero)

---

## 🗄️ BANCO DE DADOS

### **1 Tabela: MOVIES**

```
┌──────────────┐
│    MOVIES    │
├──────────────┤
│ id           │ → Número do filme (1, 2, 3...)
│ title        │ → Nome do filme
│ description  │ → Sinopse
│ year         │ → Ano de lançamento
│ genre        │ → Gênero (Ação, Drama, Comédia...)
│ duration     │ → Duração em minutos
│ rating       │ → Classificação (L, 10, 12, 14, 16, 18)
│ poster       │ → Link da capa do filme
│ videoUrl     │ → Link do vídeo para assistir
│ trailer      │ → Link do trailer
└──────────────┘
```

---

## 📡 ENDPOINTS (URLs DA API)

### **GET /api/movies**
**O que faz:** Lista todos os filmes

**Exemplo:**
```
http://localhost:8000/api/movies
```

**Resposta:**
```json
{
  "total": 2,
  "movies": [
    {
      "id": 1,
      "title": "Vingadores",
      "description": "Heróis se unem...",
      "year": 2012,
      "genre": "Ação",
      "duration": 143,
      "rating": "12",
      "poster": "https://...",
      "videoUrl": "https://...",
      "trailer": "https://..."
    }
  ]
}
```

---

### **GET /api/movies/:id**
**O que faz:** Busca um filme específico

**Exemplo:**
```
http://localhost:8000/api/movies/1
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Vingadores",
  "description": "Heróis se unem para salvar o mundo",
  "videoUrl": "https://link-do-video.com"
}
```

---

### **POST /api/movies**
**O que faz:** Adiciona um novo filme

**Exemplo:**
```json
{
  "title": "Homem-Aranha",
  "description": "Peter Parker vira herói",
  "year": 2002,
  "genre": "Ação",
  "duration": 121,
  "rating": "L",
  "poster": "https://poster.jpg",
  "videoUrl": "https://video.mp4",
  "trailer": "https://trailer.mp4"
}
```

---

## 🚀 COMO USAR

### **1. Instalar dependências**
```bash
cd backend
npm install
```

### **2. Criar banco de dados**
Abra o pgAdmin e execute:
```sql
CREATE DATABASE cinemax_streaming;
```

### **3. Criar tabela**
Crie arquivo `sync.js` na pasta backend:
```javascript
require('dotenv').config();
const sequelize = require('./src/database');
require('./src/models/Movie');

sequelize.sync({ force: true })
  .then(() => {
    console.log('✅ Tabela criada!');
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

### **4. Adicionar filmes de teste**
Crie arquivo `seed.js`:
```javascript
require('dotenv').config();
const Movie = require('./src/models/Movie');

async function seed() {
  await Movie.create({
    title: 'Vingadores',
    description: 'Heróis se unem para salvar o mundo',
    year: 2012,
    genre: 'Ação',
    duration: 143,
    rating: '12',
    poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=eOrNdBpGMv8',
    trailer: 'https://www.youtube.com/watch?v=eOrNdBpGMv8'
  });

  await Movie.create({
    title: 'Homem-Aranha',
    description: 'Peter Parker vira herói',
    year: 2002,
    genre: 'Ação',
    duration: 121,
    rating: 'L',
    poster: 'https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=t06RUxPbp_c',
    trailer: 'https://www.youtube.com/watch?v=t06RUxPbp_c'
  });

  console.log('✅ Filmes adicionados!');
  process.exit(0);
}

seed();
```

Execute:
```bash
node seed.js
```

### **5. Iniciar servidor**
```bash
npm run dev
```

---

## 🎨 COMO O FRONTEND USA

### **Tela Inicial - Catálogo**
```javascript
// Buscar todos os filmes
fetch('http://localhost:8000/api/movies')
  .then(res => res.json())
  .then(data => {
    // Mostrar cards com poster e título
    data.movies.forEach(movie => {
      console.log(movie.title, movie.poster);
    });
  });
```

### **Tela do Filme - Player**
```javascript
// Buscar filme específico
fetch('http://localhost:8000/api/movies/1')
  .then(res => res.json())
  .then(movie => {
    // Mostrar player de vídeo
    console.log(movie.videoUrl);
    // <video src={movie.videoUrl} />
  });
```

---

## 📊 O QUE ESTÁ PRONTO (1/3)

✅ **Backend:**
- Banco de dados configurado
- Model de filmes
- API para listar filmes
- API para buscar um filme
- API para adicionar filme

❌ **Falta (2/3):**
- Sistema de usuários (login/cadastro)
- Lista de favoritos
- Histórico de visualização
- Sistema de busca
- Filtros por gênero
- Avaliações/comentários

---

## 💡 FLUXO DO USUÁRIO

```
1. Usuário abre o site
   ↓
2. Frontend faz: GET /api/movies
   ↓
3. Mostra catálogo com capas dos filmes
   ↓
4. Usuário clica em um filme
   ↓
5. Frontend faz: GET /api/movies/1
   ↓
6. Mostra player de vídeo com o filme
   ↓
7. Usuário assiste
```

---

## 🎯 PRÓXIMOS PASSOS

**Para completar o projeto, você vai precisar:**

1. **Sistema de Usuários (30%)**
   - Cadastro
   - Login
   - Perfil

2. **Funcionalidades (40%)**
   - Favoritos
   - Histórico
   - Busca
   - Filtros

3. **Melhorias (30%)**
   - Recomendações
   - Avaliações
   - Comentários

---

Agora você tem um Netflix básico funcionando! 🎬🍿
