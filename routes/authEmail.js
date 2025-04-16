const express = require('express');
const router = express.Router();
const admin = require('../firebase');

// Registrar usuário
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.status(201).send({ message: 'Usuário criado com sucesso!', user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Login - Aqui, você pode usar Firebase Admin apenas para validar token JWT
// O ideal seria gerar o JWT no frontend com firebase JS SDK (posso te ajudar nisso)

module.exports = router;
