const express = require('express');
const router = express.Router();
const Unidade = require('../models/Unidade');
const Agendamento = require('../models/Agendamento'); // Para pegar os agendamentos

// Rota para buscar a disponibilidade de uma unidade
router.get('/:unidadeId/:data', async (req, res) => {
  try {
    const { unidadeId, data } = req.params;
    const dataFormatada = new Date(data);

    // Buscar os agendamentos para a unidade no dia solicitado
    const agendamentos = await Agendamento.find({
      unidade: unidadeId,
      startTime: { $gte: new Date(dataFormatada.setHours(0, 0, 0, 0)), $lt: new Date(dataFormatada.setHours(23, 59, 59, 999)) }
    });

    // Converter agendamentos em formato de evento para o FullCalendar
    const eventos = agendamentos.map(agendamento => ({
      title: 'Doação de sangue',
      start: agendamento.startTime,
      end: agendamento.endTime,
      description: `Paciente: ${agendamento.nome}, Idade: ${agendamento.idade}`,
      color: 'red',  // Exemplo de cor para marcar eventos ocupados
    }));

    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).send('Erro ao buscar disponibilidade.');
  }
});

module.exports = router;
