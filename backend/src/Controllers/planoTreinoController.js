const OpenAI = require('openai');
const { PlanoTreino, Perfilfisico, DadosFisico, PreferenciasTreino, SaudeRestricao, PreferenciasAlimentar } = require('../models');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

function getOpenAI() {
  const envPath = path.join(__dirname, '../../.env');
  const parsed = dotenv.parse(fs.readFileSync(envPath));
  return new OpenAI({ apiKey: parsed.OPENAI_API_KEY });
}

const PARQ_PERGUNTAS = [
  'Algum médico já disse que você possui problema cardíaco',
  'Você sente dor no peito durante atividade física',
  'Já perdeu equilíbrio ou consciência durante exercícios',
  'Possui problema ósseo ou articular',
  'Usa medicamentos para pressão ou coração',
];

function buildParqAlerta(parqJson) {
  if (!parqJson) return '';
  try {
    const respostas = JSON.parse(parqJson);
    const alertas = PARQ_PERGUNTAS.filter((_, i) => respostas[i] === true);
    return alertas.map(p => `- ${p}`).join('\n');
  } catch {
    return '';
  }
}

function safeArr(json) {
  try { return json ? JSON.parse(json) : []; } catch { return []; }
}

function buildPrompt(perfil) {
  const parqAlerta = buildParqAlerta(perfil.parq);
  const prefTreino = safeArr(perfil.preferencia_treino).join(', ');

  const linhas = [
    `PERFIL FÍSICO:`,
    perfil.sexo ? `- Sexo: ${perfil.sexo}` : null,
    `- Peso: ${perfil.peso}kg | Altura: ${perfil.altura}cm | Idade: ${perfil.idade} anos`,
    perfil.peso_desejado ? `- Peso desejado: ${perfil.peso_desejado}kg` : null,
    ``,
    `OBJETIVO:`,
    `- Objetivo: ${perfil.objetivo}`,
    perfil.prazo_objetivo ? `- Prazo: ${perfil.prazo_objetivo}` : null,
    perfil.resultado_satisfatorio ? `- Resultado esperado: ${perfil.resultado_satisfatorio}` : null,
    ``,
    `EXPERIÊNCIA:`,
    perfil.nivel_musculacao ? `- Nível na musculação: ${perfil.nivel_musculacao}` : null,
    perfil.tempo_treino ? `- Tempo treinando: ${perfil.tempo_treino}` : null,
    perfil.sabe_executar_basicos ? `- Executa básicos: ${perfil.sabe_executar_basicos}` : null,
    ``,
    `DISPONIBILIDADE:`,
    perfil.dias_disponiveis ? `- Dias disponíveis: ${safeArr(perfil.dias_disponiveis).join(', ')}` : null,
    perfil.tempo_por_treino ? `- Tempo por treino: ${perfil.tempo_por_treino}` : null,
    perfil.periodo_treino ? `- Período preferido: ${perfil.periodo_treino}` : null,
    perfil.nivel_atv_fisica ? `- Rotina diária: ${perfil.nivel_atv_fisica}` : null,
    ``,
    `ESTRUTURA:`,
    perfil.local_treino ? `- Local: ${perfil.local_treino}` : null,
    perfil.equipamentos ? `- Equipamentos: ${perfil.equipamentos}` : null,
    perfil.academia_completa ? `- Academia completa: ${perfil.academia_completa}` : null,
    prefTreino ? `- Preferências de treino: ${prefTreino}` : null,
    perfil.modalidades ? `- Modalidades esportivas: ${safeArr(perfil.modalidades).join(', ')}` : null,
    ``,
    `PREFERÊNCIAS:`,
    perfil.preferencia_duracao_treino ? `- Duração: ${perfil.preferencia_duracao_treino}` : null,
    perfil.gosta_cardio ? `- Gosta de cardio: ${perfil.gosta_cardio}` : null,
    perfil.treino_dividido ? `- Tipo: ${perfil.treino_dividido}` : null,
    perfil.exercicios_favoritos ? `- Exercícios favoritos: ${perfil.exercicios_favoritos}` : null,
    perfil.exercicios_odeia ? `- Exercícios que odeia: ${perfil.exercicios_odeia}` : null,
    ``,
    `SAÚDE:`,
    perfil.tem_lesao === 'sim' ? `- Possui lesão: Sim` : null,
    perfil.dores_frequentes === 'sim' ? `- Dores frequentes: Sim` : null,
    perfil.limitacao_fisica === 'sim' ? `- Limitação física: Sim` : null,
    perfil.exercicio_desconforto === 'sim' ? `- Exercício com desconforto: Sim` : null,
    perfil.usa_medicamentos === 'sim' ? `- Usa medicamentos: Sim` : null,
    perfil.faz_cardio ? `- Faz cardio atualmente: ${perfil.faz_cardio}` : null,
    perfil.obervacoes ? `- Observações: ${perfil.obervacoes}` : null,
    parqAlerta ? `\nAVISO PAR-Q (respondeu SIM):\n${parqAlerta}\nAdapte o plano considerando essas condições, priorizando segurança.` : null,
  ].filter(Boolean);

  const modalidadesArr = safeArr(perfil.modalidades);
  const restricaoModalidade = modalidadesArr.length > 0
    ? `\nRESTRIÇÃO OBRIGATÓRIA: O plano deve conter EXCLUSIVAMENTE exercícios e atividades das modalidades selecionadas (${modalidadesArr.join(', ')}). NÃO inclua exercícios de outras modalidades. Por exemplo, se o usuário pratica apenas natação, o plano deve conter somente treinos de natação — nunca musculação, corrida ou qualquer outra modalidade não listada.`
    : '';

  return `Crie um plano de treino semanal personalizado para uma pessoa com as seguintes características:\n\n${linhas.join('\n')}${restricaoModalidade}\n\nFormate com os dias da semana (Segunda a Domingo). Para cada dia: nome do treino, exercícios com séries, repetições e descanso. Inclua aquecimento e alongamento. Seja detalhado e prático.`;
}

const INCLUDES = [
  { model: DadosFisico },
  { model: PreferenciasTreino },
  { model: SaudeRestricao },
  { model: PreferenciasAlimentar },
];

function flattenPerfil(perfil) {
  const strip = obj => {
    if (!obj) return {};
    const { id, perfilId, createdAt, updatedAt, ...rest } = obj.toJSON ? obj.toJSON() : obj;
    return rest;
  };
  return {
    ...strip(perfil.DadosFisico),
    ...strip(perfil.PreferenciasTreino),
    ...strip(perfil.SaudeRestricao),
    ...strip(perfil.PreferenciasAlimentar),
    fotos: perfil.fotos,
  };
}

const gerar = async (req, res) => {
  try {
    const perfilRaw = await Perfilfisico.findOne({ where: { usuarioId: req.user.id }, include: INCLUDES });
    if (!perfilRaw) {
      return res.status(404).json({ error: 'Perfil físico não encontrado. Preencha o questionário primeiro.' });
    }
    const perfil = flattenPerfil(perfilRaw);

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer experiente e certificado. Crie planos de treino personalizados, seguros e eficazes baseados nas características do aluno.',
        },
        { role: 'user', content: buildPrompt(perfil) },
      ],
      max_tokens: 2500,
    });

    const descricao = completion.choices[0].message.content;
    const plano = await PlanoTreino.create({ descricao, objetivo: perfil.objetivo, perfilId: perfilRaw.id });
    res.status(201).json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    const planos = await PlanoTreino.findAll({
      where: { perfilId: perfil.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obter = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    const plano = await PlanoTreino.findOne({ where: { id: req.params.id, perfilId: perfil.id } });
    if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    const deleted = await PlanoTreino.destroy({ where: { id: req.params.id, perfilId: perfil.id } });
    if (!deleted) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json({ message: 'Plano removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { gerar, listar, obter, deletar };
