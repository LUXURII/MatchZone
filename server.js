require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ROTA DE SEGURANÇA (Health Check) - Impede o Railway de desligar o container
app.get('/health', (req, res) => res.status(200).send('Servidor Ativo'));

// CONEXÃO DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Base de Dados Conectada'))
  .catch(err => console.error('❌ Erro DB:', err));

// ROTAS API
app.use('/api/auth', require('./routes/authRoutes'));

// ROTA RAIZ - Garante que o index.html abre sempre no link principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 MatchZone Online na porta ${PORT}`));
