require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Essencial para resolver caminhos de ficheiros
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Define a pasta public de forma absoluta para evitar erros de diretório
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROTA DE HEALTH CHECK (Impede o "Stopping Container")
// O Railway chama esta rota para saber se o servidor está online.
app.get('/health', (req, res) => res.status(200).send('OK'));

// Conexão DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Base de Dados Conectada'))
  .catch(err => console.error('❌ Erro DB:', err));

// Rotas API
app.use('/api/auth', require('./routes/authRoutes'));

// Rota para garantir que a raiz entrega o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Porta dinâmica para o Railway (8080 ou a definida pelo sistema)
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MatchZone Online na porta ${PORT}`);
});
