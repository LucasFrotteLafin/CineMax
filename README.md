# CineMax

Plataforma de streaming de filmes com catálogo completo, busca e gerenciamento de conteúdo.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para APIs REST
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para Node.js
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização e layout responsivo
- **JavaScript (Vanilla)** - Interatividade e consumo da API

## 🛠️ Ferramentas

- **Nodemon** - Reinicialização automática do servidor (desenvolvimento)
- **Git** - Controle de versão

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## 🧪 Como Testar

### Passo 1: Iniciar o Backend

```bash
cd backend
npm run dev
```
O servidor estará rodando em `http://localhost:3000`

### Passo 2: Abrir o Frontend

Abra o arquivo `frontend/index.html` no navegador ou use um servidor local:

```bash
cd frontend

# Usando Node.js (http-server)
npx http-server -p 8000
```
Acesse: `http://localhost:8000`

### Passo 3: Testar Funcionalidades

#### Adicionar Filme
1. Clique no botão "+ Adicionar Filme"
2. Preencha o formulário:
   - Título
   - Descrição
   - Ano
   - Gênero
   - Duração (minutos)
   - Classificação Etária
   - URL do Poster
3. Clique em "Adicionar Filme"

#### Buscar Filmes
1. Digite o nome do filme na barra de busca
2. Clique no botão de busca 🔍
3. Os resultados serão filtrados automaticamente

#### Visualizar Catálogo
- Todos os filmes cadastrados aparecem na página inicial
- Cada card exibe: poster, título, ano, gênero, duração e classificação

#### Deletar Filme
- Clique no botão "Remover" no card do filme desejado

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/movies` | Lista todos os filmes |
| GET | `/api/movies/:id` | Busca filme por ID |
| POST | `/api/movies` | Adiciona novo filme |
| DELETE | `/api/movies/:id` | Remove filme por ID |

## 📦 Estrutura do Projeto

```
CineMax/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── setup.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html
└── README.md
```

## 🎯 Funcionalidades

- ✅ Listagem de filmes
- ✅ Busca por título
- ✅ Adicionar novos filmes
- ✅ Remover filmes
- ✅ Interface responsiva
- ✅ API RESTful
