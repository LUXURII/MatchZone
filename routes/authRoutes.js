const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Stats = require('../models/Stats'); // <-- IMPORTANTE: Importar o model de Stats

// ROTA DE REGISTO (POST)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Este e-mail já existe' });

    user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // NOVIDADE v1.3.1: Cria automaticamente a ficha de estatísticas do jogador
    const newStats = new Stats({
      user: user.id,
      username: user.username,
      elo: 1000,
      wins: 0,
      losses: 0
    });
    await newStats.save();

    res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao guardar utilizador' });
  }
});

// ROTA DE LOGIN (POST) - (Mantém-se igual)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretzone2025', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

// ROTA DE PERFIL (GET) - (Mantém-se igual)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

module.exports = router;
