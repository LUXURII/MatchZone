require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Base de Dados Conectada'))
  .catch(err => console.error('❌ Erro DB:', err));

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 MatchZone Online na porta ${PORT}`));
