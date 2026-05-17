const { historico_progresso, Perfilfisico } = require('../models');

const listar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });

    const historico = await historico_progresso.findAll({
      where: { perfilId: perfil.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registrar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado. Preencha o questionário primeiro.' });

    const { peso, obervacoes } = req.body;
    const fotos = req.files && req.files.length > 0
      ? JSON.stringify(req.files.map(f => `/uploads/${f.filename}`))
      : null;
    const entrada = await historico_progresso.create({ peso, obervacoes, fotos, perfilId: perfil.id });

    await perfil.update({ peso });

    res.status(201).json(entrada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listar, registrar };
