require('dotenv').config();
const sequelize = require('./src/database/connection');
const Movie = require('./src/models/Movie');

async function setup() {
  try {
    // Criar tabela
    await sequelize.sync({ force: true });
    console.log('✅ Tabela criada!');
    
    console.log('✅ Tabela pronta para receber filmes!');
    console.log('\n🎬 Setup completo!\n🚀 Execute: npm run dev\n📝 Adicione filmes via POST /api/movies');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setup();
