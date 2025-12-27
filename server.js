require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/**
 * 1. PRIORIDADE MÁXIMA: RESPOSTA AO RAILWAY
 */
app.get('/health', (req, res) => res.status(200).send('OK'));

// 2. CONFIGURAÇÕES DE MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. ROTAS DA API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stats', require('./routes/statsRoutes')); // <-- NOVA ROTA ADICIONADA AQUI

// 4. ROTA PRINCIPAL (SPA FALLBACK)
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  // Atualizado para v1.3.0 indicando a evolução para Rankings Reais
  console.log(`🚀 MatchZone v1.3.0 Online na porta ${PORT}`);
  
  // 6. CONEXÃO COM O MONGO EM SEGUNDO PLANO
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada com Sucesso'))
      .catch(err => console.error('❌ Erro de Conexão DB:', err));
  } else {
    console.log('⚠️ Aviso: MONGO_URI não encontrada.');
  }
});
