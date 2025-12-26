require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Adicionado para gerenciar caminhos de arquivos
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota de Health Check (Impede o Railway de desligar o container)
app.get('/health', (req, res) => res.status(200).send('OK'));

// Conexão ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Base de Dados Conectada'))
  .catch(err => console.error('❌ Erro DB:', err));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));

// Rota Principal: Entrega o index.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Porta configurada para 2025 ( Railway utiliza a variável PORT )
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
});
