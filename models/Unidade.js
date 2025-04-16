const mongoose = require('../db');  // Importando a conexão com o banco

// Definir o modelo de Unidade de Coleta
const UnidadeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  endereco: { type: String, required: true },
  capacidadePorHorario: { type: Number, required: true }
});

module.exports = mongoose.model('Unidade', UnidadeSchema);  // Exporta o modelo
