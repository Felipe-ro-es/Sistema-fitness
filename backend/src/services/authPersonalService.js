'use strict';
const bcrypt = require('bcryptjs');
const { PersonalTrainer } = require('../models');
const { generateToken } = require('../utils/token');

const register = async ({ nome, email, senha, cref }) => {
  const existing = await PersonalTrainer.findOne({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');
  const hash = await bcrypt.hash(senha, 10);
  const pt = await PersonalTrainer.create({ nome, email, senha: hash, cref });
  const token = generateToken({ id: pt.id, email: pt.email, role: 'personal' });
  return { personal: { id: pt.id, nome: pt.nome, email: pt.email, cref: pt.cref }, token };
};

const login = async ({ email, senha }) => {
  const pt = await PersonalTrainer.findOne({ where: { email } });
  if (!pt) throw new Error('Credenciais inválidas');
  const valid = await bcrypt.compare(senha, pt.senha);
  if (!valid) throw new Error('Credenciais inválidas');
  const token = generateToken({ id: pt.id, email: pt.email, role: 'personal' });
  return { personal: { id: pt.id, nome: pt.nome, email: pt.email, cref: pt.cref }, token };
};

module.exports = { register, login };
