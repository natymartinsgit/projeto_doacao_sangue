require('dotenv').config();
const mongoose = require('mongoose');

// Conectar ao MongoDB usando a string de conexão do .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Erro na conexão
db.on('error', console.error.bind(console, '❌ Erro ao conectar ao MongoDB:'));
// Sucesso na conexão
db.once('open', () => console.log('✅ Conectado ao MongoDB Atlas'));

module.exports = mongoose;
