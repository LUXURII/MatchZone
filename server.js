require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middlewares de Base
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota de Health Check (Sinal de vida para o Railway)
app.get('/health', (req, res) => res.status(200).send('OK'));

// 3. Definição das Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));

// 4. Rota Principal (Entrega o Frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. INICIALIZAÇÃO IMEDIATA (O segredo para 2025)
const PORT = process.env.PORT || 8080;

// O servidor começa a ouvir a porta ANTES de tentar ligar à base de dados
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
  
  // 6. Conexão com o MongoDB em segundo plano (Não trava o boot)
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada'))
      .catch(err => console.error('❌ Erro de Conexão DB:', err));
  } else {
    console.error('❌ Erro: MONGO_URI não configurada nas variáveis do Railway.');
  }
});
