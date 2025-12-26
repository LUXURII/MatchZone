const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  // O erro MODULE_NOT_FOUND não vai mais acontecer, pois o caminho está correto
  if (!token) return res.status(401).json({ message: 'Acesso Negado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'matchzone2025');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Sessão Expirada' });
  }
};
