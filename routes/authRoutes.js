const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');

// --- ROTA DE REGISTRO (POST) ---
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'E-mail já cadastrado' });

    user = new User({ username, email, password });

    // Encripta a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar no banco de dados' });
  }
});

// --- ROTA DE LOGIN (Opcional, mas recomendada aqui) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretzone', { expiresIn: '7d' });
        res.json({ token });
    } catch (err) { res.status(500).send('Erro no servidor'); }
});

// --- ROTA DE PERFIL (GET) ---
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

module.exports = router;
