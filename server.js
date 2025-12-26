require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta /public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ROTA DE HEALTH CHECK
 * Essencial para o Railway manter o container ligado.
 * Configure o "Healthcheck Path" no painel do Railway como: /health
 */
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Conexão com o Banco de Dados (MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Base de Dados Conectada'))
  .catch(err => console.error('❌ Erro de Conexão DB:', err));

// Definição das Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));

/**
 * ROTA RAIZ
 * Garante que ao acessar o domínio principal, o index.html seja entregue.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração da Porta para 2025
// O Railway utiliza automaticamente a variável de ambiente PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
});
