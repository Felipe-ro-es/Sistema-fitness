const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { generateToken } = require('../utils/token');

const register = async ({ nome, email, senha }) => {
  const existing = await Usuario.findOne({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');
  const hash = await bcrypt.hash(senha, 10);
  const user = await Usuario.create({ nome, email, senha: hash });
  const token = generateToken({ id: user.id, email: user.email });
  return { user: { id: user.id, nome: user.nome, email: user.email }, token };
};

const login = async ({ email, senha }) => {
  const user = await Usuario.findOne({ where: { email } });
  if (!user) throw new Error('Credenciais inválidas');
  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error('Credenciais inválidas');
  const token = generateToken({ id: user.id, email: user.email });
  return { user: { id: user.id, nome: user.nome, email: user.email }, token };
};

module.exports = { register, login };
