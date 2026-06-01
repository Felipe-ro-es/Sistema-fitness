'use strict';
const { Op } = require('sequelize');
const { PlanoTreino, Perfilfisico, Usuario, DadosFisico, PreferenciasTreino, SaudeRestricao, historico_progresso } = require('../models');

const listarPendentes = async (req, res) => {
  try {
    const planos = await PlanoTreino.findAll({
      where: { status: ['pendente', 'revisao'] },
      order: [['createdAt', 'ASC']],
      include: [{
        model: Perfilfisico,
        where: {
          [Op.or]: [{ personalId: req.personal.id }, { personalId: null }],
        },
        include: [{ model: Usuario, attributes: ['nome', 'email'] }],
      }],
    });
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listarValidados = async (req, res) => {
  try {
    const planos = await PlanoTreino.findAll({
      where: { status: 'validado' },
      order: [['updatedAt', 'DESC']],
      include: [{
        model: Perfilfisico,
        where: { personalId: req.personal.id },
        include: [{ model: Usuario, attributes: ['nome', 'email'] }],
      }],
    });
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obter = async (req, res) => {
  try {
    const plano = await PlanoTreino.findByPk(req.params.id, {
      include: [{
        model: Perfilfisico,
        include: [{ model: Usuario, attributes: ['nome', 'email'] }],
      }],
    });
    if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validar = async (req, res) => {
  try {
    const plano = await PlanoTreino.findByPk(req.params.id);
    if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });
    const { descricao } = req.body;
    await plano.update({
      status: 'validado',
      personalId: req.personal.id,
      ...(descricao !== undefined && { descricao }),
    });
    await Perfilfisico.update(
      { personalId: req.personal.id },
      { where: { id: plano.perfilId } }
    );
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const perfis = await Perfilfisico.findAll({
      include: [
        { model: Usuario, attributes: ['nome', 'email'] },
        { model: DadosFisico },
        { model: PreferenciasTreino },
        { model: SaudeRestricao },
        { model: historico_progresso, order: [['data', 'ASC']] },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json(perfis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listarPendentes, listarValidados, obter, validar, listarUsuarios };
