require('dotenv').config();
const mongoose = require('../db'); // usa a conexão do db.js
const Unidade = require('../models/Unidade'); // importa o model

// Lista de unidades de coleta em São Paulo
const unidades = [
  {
    nome: 'Hospital das Clínicas',
    endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César, São Paulo - SP',
    capacidadePorHorario: 10
  },
  {
    nome: 'Hemocentro São Paulo',
    endereco: 'R. Dr. Enéas de Carvalho Aguiar, 155 - Cerqueira César, São Paulo - SP',
    capacidadePorHorario: 12
  },
  {
    nome: 'Santa Casa de São Paulo',
    endereco: 'R. Dr. Cesário Mota Júnior, 112 - Vila Buarque, São Paulo - SP',
    capacidadePorHorario: 8
  },
  {
    nome: 'Hospital do Servidor Público Estadual',
    endereco: 'R. Pedro de Toledo, 1800 - Vila Clementino, São Paulo - SP',
    capacidadePorHorario: 10
  },
  {
    nome: 'Hospital São Paulo - UNIFESP',
    endereco: 'R. Napoleão de Barros, 715 - Vila Clementino, São Paulo - SP',
    capacidadePorHorario: 9
  }
];

async function adicionarUnidades() {
  try {
    await Unidade.insertMany(unidades);
    console.log('✅ Unidades de coleta adicionadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao adicionar unidades:', error);
  } finally {
    mongoose.connection.close(); // fecha a conexão após inserir
  }
}

adicionarUnidades();
