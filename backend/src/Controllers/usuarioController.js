const { Usuario, Perfilfisico } = require('../models');

const ALLOWED_FIELDS = [
  'peso', 'altura', 'idade', 'objetivo', 'nivel_atv_fisica', 'obervacoes', 'parq',
  'sexo', 'peso_desejado', 'percentual_gordura', 'medidas_corporais',
  'prazo_objetivo', 'resultado_satisfatorio', 'tentou_antes',
  'nivel_musculacao', 'tempo_treino', 'seguiu_dieta', 'sabe_executar_basicos',
  'dias_treino_semana', 'tempo_por_treino', 'periodo_treino', 'trabalho_postura',
  'local_treino', 'equipamentos', 'academia_completa', 'preferencia_treino',
  'tem_lesao', 'dores_frequentes', 'limitacao_fisica', 'exercicio_desconforto',
  'acompanhamento_medico', 'usa_medicamentos',
  'refeicoes_dia', 'restricao_alimentar', 'alimentos_nao_gosta', 'alimentos_gosta',
  'dificuldade_dieta', 'cozinha_refeicoes', 'gasto_alimentacao',
  'horas_sono', 'nivel_estresse', 'agua_dia', 'consome_alcool', 'fuma', 'faz_cardio',
  'preferencia_duracao_treino', 'gosta_cardio', 'treino_dividido',
  'exercicios_favoritos', 'exercicios_odeia',
];

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
    const dados = Object.fromEntries(
      ALLOWED_FIELDS
        .filter(k => req.body[k] !== undefined)
        .map(k => [k, req.body[k]])
    );

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
