require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. ROTA DE HEALTH CHECK (Prioridade Máxima)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// 3. Definição das Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));

// 4. ROTA RAIZ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 8080;

// O segredo: Iniciar o listen primeiro para o Railway ver que o site está vivo
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
  
  // 6. CONEXÃO COM O BANCO (Em segundo plano)
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada'))
      .catch(err => console.error('❌ Erro Crítico DB:', err));
  } else {
    console.error('❌ Erro: MONGO_URI não definida nas variáveis de ambiente.');
  }
});
