require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/**
 * 1. PRIORIDADE MÁXIMA: RESPOSTA AO RAILWAY
 * Health Check essencial para manter o container rodando 24/7.
 */
app.get('/health', (req, res) => res.status(200).send('OK'));

// 2. CONFIGURAÇÕES DE MIDDLEWARE
app.use(cors());
app.use(express.json());

// Servindo arquivos estáticos (Frontend v1.2.0)
app.use(express.static(path.join(__dirname, 'public')));

// 3. ROTAS DA API
app.use('/api/auth', require('./routes/authRoutes'));

// 4. ROTA PRINCIPAL (SPA FALLBACK)
// Garante que o index.html seja entregue em qualquer rota não-api
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  // Atualizado para v1.2.0 conforme o novo conteúdo
  console.log(`🚀 MatchZone v1.2.0 Online na porta ${PORT}`);
  
  // 6. CONEXÃO COM O MONGO EM SEGUNDO PLANO
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada com Sucesso'))
      .catch(err => console.error('❌ Erro de Conexão DB:', err));
  } else {
    console.log('⚠️ Aviso: MONGO_URI não encontrada.');
  }
});
