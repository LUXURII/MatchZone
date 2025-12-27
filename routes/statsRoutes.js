const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

// GET /api/stats/rankings
router.get('/rankings', async (req, res) => {
  try {
    const rankings = await Stats.find()
      .sort({ elo: -1 }) // Ordena do maior ELO para o menor
      .limit(10);        // Pega os top 10
    res.json(rankings);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar ranking' });
  }
});

module.exports = router;
