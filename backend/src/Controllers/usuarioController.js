const { Usuario, Perfilfisico } = require('../models');

const getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'nome', 'email'],
    });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPerfilFisico = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    res.json(perfil);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const salvarPerfilFisico = async (req, res) => {
  try {
    const { peso, altura, idade, objetivo, nivel_atv_fisica, obervacoes } = req.body;
    const dados = { peso, altura, idade, objetivo, nivel_atv_fisica, obervacoes };

    let perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (perfil) {
      await perfil.update(dados);
      res.json(perfil);
    } else {
      perfil = await Perfilfisico.create({ ...dados, usuarioId: req.user.id });
      res.status(201).json(perfil);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPerfil, getPerfilFisico, salvarPerfilFisico };
