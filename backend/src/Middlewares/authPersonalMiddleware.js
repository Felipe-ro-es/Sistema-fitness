'use strict';
const { verifyToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload.role !== 'personal') {
      return res.status(403).json({ error: 'Acesso restrito a personal trainers' });
    }
    req.personal = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
