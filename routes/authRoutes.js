const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // O segredo está no "../"
const User = require('../models/User');
// ... adicione funções de login/registro aqui se quiser

// Rota de Perfil (Protegida)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send('Erro no servidor'); }
});

module.exports = router;
