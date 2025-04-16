const mongoose = require('../db'); // Conexão com o banco de dados

const AgendamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  unidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidade', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model('Agendamento', AgendamentoSchema);
