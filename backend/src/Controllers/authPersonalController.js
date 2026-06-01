'use strict';
const authPersonalService = require('../services/authPersonalService');

const register = async (req, res) => {
  try {
    const result = await authPersonalService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authPersonalService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { register, login };
