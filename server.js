require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/**
 * 1. PRIORIDADE MÁXIMA: RESPOSTA AO RAILWAY
 * Colocamos o Health Check no topo para o servidor responder "OK" 
 * antes mesmo de processar qualquer outra coisa.
 */
app.get('/health', (req, res) => res.status(200).send('OK'));

// 2. CONFIGURAÇÕES DE MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. ROTAS DA API
app.use('/api/auth', require('./routes/authRoutes'));

// 4. ROTA PRINCIPAL (FRONTEND)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 8080;

// Escutamos a porta PRIMEIRO para garantir estabilidade no deploy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone v1.1.3 Online na porta ${PORT}`);
  
  // 6. CONEXÃO COM O MONGO EM SEGUNDO PLANO
  // Isso impede que lentidões no banco de dados derrubem o servidor no início
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Base de Dados Conectada com Sucesso'))
      .catch(err => console.error('❌ Erro de Conexão DB:', err));
  } else {
    console.log('⚠️ Aviso: MONGO_URI não encontrada.');
  }
});
