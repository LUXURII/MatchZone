require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Configurações de Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota de Health Check (Crucial para o Railway manter o site online)
app.get('/health', (req, res) => res.status(200).send('OK'));

// 3. Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));

// 4. Rota Principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Inicialização do Servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
  
  // 6. Conexão ao MongoDB Atlas (Usando as novas credenciais das variáveis)
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada com a nova senha'))
      .catch(err => console.error('❌ Erro de Conexão DB:', err));
  } else {
    console.error('❌ Erro: MONGO_URI não encontrada nas variáveis de ambiente.');
  }
});
