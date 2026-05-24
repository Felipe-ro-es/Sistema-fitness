'use strict';
const path = require('path');
const {
  Usuario, Perfilfisico, historico_progresso,
  DadosFisico, PreferenciasTreino, SaudeRestricao, PreferenciasAlimentar,
} = require('../models');

const DADOS_FISICOS_FIELDS = [
  'objetivo', 'prazo_objetivo', 'resultado_satisfatorio', 'tentou_antes',
  'peso', 'altura', 'idade', 'sexo', 'peso_desejado', 'percentual_gordura',
  'medidas_corporais', 'obervacoes',
];

const PREF_TREINO_FIELDS = [
  'nivel_musculacao', 'tempo_treino', 'seguiu_dieta', 'sabe_executar_basicos',
  'dias_treino_semana', 'tempo_por_treino', 'periodo_treino', 'nivel_atv_fisica',
  'trabalho_postura', 'dias_disponiveis', 'local_treino', 'equipamentos',
  'academia_completa', 'preferencia_treino', 'modalidades',
  'preferencia_duracao_treino', 'gosta_cardio', 'treino_dividido',
  'exercicios_favoritos', 'exercicios_odeia',
];

const SAUDE_FIELDS = [
  'tem_lesao', 'dores_frequentes', 'limitacao_fisica', 'exercicio_desconforto',
  'acompanhamento_medico', 'usa_medicamentos', 'parq',
  'horas_sono', 'nivel_estresse', 'agua_dia', 'consome_alcool', 'fuma', 'faz_cardio',
];

const ALIMENTAR_FIELDS = [
  'refeicoes_dia', 'restricao_alimentar', 'alimentos_nao_gosta', 'alimentos_gosta',
  'dificuldade_dieta', 'cozinha_refeicoes', 'gasto_alimentacao',
];

function pick(obj, fields) {
  return Object.fromEntries(fields.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]));
}

async function upsertSubtable(Model, data, perfilId) {
  const [instance] = await Model.findOrCreate({ where: { perfilId }, defaults: { ...data, perfilId } });
  if (Object.keys(data).length > 0) await instance.update(data);
}

function flattenPerfil(perfil) {
  const strip = obj => {
    if (!obj) return {};
    const { id, perfilId, createdAt, updatedAt, ...rest } = obj.toJSON ? obj.toJSON() : obj;
    return rest;
  };
  return {
    id: perfil.id,
    usuarioId: perfil.usuarioId,
    fotos: perfil.fotos,
    ...strip(perfil.DadosFisico),
    ...strip(perfil.PreferenciasTreino),
    ...strip(perfil.SaudeRestricao),
    ...strip(perfil.PreferenciasAlimentar),
  };
}

const INCLUDES = [
  { model: DadosFisico },
  { model: PreferenciasTreino },
  { model: SaudeRestricao },
  { model: PreferenciasAlimentar },
];

const getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, { attributes: ['id', 'nome', 'email'] });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPerfilFisico = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id }, include: INCLUDES });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    res.json(flattenPerfil(perfil));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const salvarPerfilFisico = async (req, res) => {
  try {
    const body = req.body;
    const dadosFisicos = pick(body, DADOS_FISICOS_FIELDS);
    const prefTreino = pick(body, PREF_TREINO_FIELDS);
    const saude = pick(body, SAUDE_FIELDS);
    const alimentar = pick(body, ALIMENTAR_FIELDS);

    const perfilData = {};
    if (req.files && req.files.length > 0) {
      perfilData.fotos = JSON.stringify(req.files.map(f => `/uploads/${f.filename}`));
    }

    let perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    const isUpdate = !!perfil;

    if (isUpdate) {
      await perfil.update(perfilData);
    } else {
      perfil = await Perfilfisico.create({ ...perfilData, usuarioId: req.user.id });
    }

    await upsertSubtable(DadosFisico, dadosFisicos, perfil.id);
    await upsertSubtable(PreferenciasTreino, prefTreino, perfil.id);
    await upsertSubtable(SaudeRestricao, saude, perfil.id);
    await upsertSubtable(PreferenciasAlimentar, alimentar, perfil.id);

    if (dadosFisicos.peso) {
      await historico_progresso.create({
        peso: dadosFisicos.peso,
        fotos: perfilData.fotos ?? null,
        perfilId: perfil.id,
      });
    }

    const perfilCompleto = await Perfilfisico.findOne({ where: { id: perfil.id }, include: INCLUDES });
    res.status(isUpdate ? 200 : 201).json(flattenPerfil(perfilCompleto));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPerfil, getPerfilFisico, salvarPerfilFisico };
