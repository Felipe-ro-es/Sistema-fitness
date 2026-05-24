const OpenAI = require('openai');
const { PlanoAlimentar, Perfilfisico, DadosFisico, PreferenciasTreino, SaudeRestricao, PreferenciasAlimentar } = require('../models');
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
  const restricoes = safeArr(perfil.restricao_alimentar).join(', ');

  const linhas = [
    `PERFIL FÍSICO:`,
    perfil.sexo ? `- Sexo: ${perfil.sexo}` : null,
    `- Peso: ${perfil.peso}kg | Altura: ${perfil.altura}cm | Idade: ${perfil.idade} anos`,
    perfil.peso_desejado ? `- Peso desejado: ${perfil.peso_desejado}kg` : null,
    perfil.percentual_gordura ? `- % Gordura: ${perfil.percentual_gordura}%` : null,
    ``,
    `OBJETIVO:`,
    `- Objetivo: ${perfil.objetivo}`,
    perfil.prazo_objetivo ? `- Prazo: ${perfil.prazo_objetivo}` : null,
    ``,
    `ATIVIDADE:`,
    perfil.nivel_atv_fisica ? `- Rotina diária: ${perfil.nivel_atv_fisica}` : null,
    perfil.dias_treino_semana ? `- Dias de treino por semana: ${perfil.dias_treino_semana}` : null,
    perfil.faz_cardio ? `- Faz cardio: ${perfil.faz_cardio}` : null,
    ``,
    `ALIMENTAÇÃO:`,
    perfil.refeicoes_dia ? `- Refeições por dia: ${perfil.refeicoes_dia}` : null,
    restricoes ? `- Restrições alimentares: ${restricoes}` : null,
    perfil.alimentos_nao_gosta ? `- Não gosta: ${perfil.alimentos_nao_gosta}` : null,
    perfil.alimentos_gosta ? `- Gosta muito: ${perfil.alimentos_gosta}` : null,
    perfil.dificuldade_dieta ? `- Dificuldade em seguir dieta: ${perfil.dificuldade_dieta}` : null,
    perfil.cozinha_refeicoes ? `- Cozinha as próprias refeições: ${perfil.cozinha_refeicoes}` : null,
    perfil.gasto_alimentacao ? `- Orçamento mensal: ${perfil.gasto_alimentacao}` : null,
    ``,
    `HÁBITOS:`,
    perfil.horas_sono ? `- Horas de sono: ${perfil.horas_sono}h` : null,
    perfil.nivel_estresse ? `- Nível de estresse: ${perfil.nivel_estresse}` : null,
    perfil.agua_dia ? `- Água por dia: ${perfil.agua_dia}` : null,
    perfil.consome_alcool ? `- Álcool: ${perfil.consome_alcool}` : null,
    perfil.fuma === 'sim' ? `- Fumante: Sim` : null,
    ``,
    `SAÚDE:`,
    perfil.usa_medicamentos === 'sim' ? `- Usa medicamentos contínuos: Sim` : null,
    perfil.obervacoes ? `- Observações: ${perfil.obervacoes}` : null,
    parqAlerta ? `\nAVISO PAR-Q (respondeu SIM):\n${parqAlerta}\nAdapte o plano alimentar considerando essas condições de saúde.` : null,
  ].filter(Boolean);

  const NOMES_REFEICOES = {
    1: ['Refeição única'],
    2: ['Café da manhã', 'Jantar'],
    3: ['Café da manhã', 'Almoço', 'Jantar'],
    4: ['Café da manhã', 'Almoço', 'Lanche da tarde', 'Jantar'],
    5: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar'],
    6: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'],
  };

  const nRefeicoes = perfil.refeicoes_dia ? Number(perfil.refeicoes_dia) : null;
  const nomesRefeicoes = nRefeicoes && NOMES_REFEICOES[nRefeicoes]
    ? NOMES_REFEICOES[nRefeicoes]
    : null;

  const instrucaoRefeicoes = nomesRefeicoes
    ? `IMPORTANTE: O plano deve ter EXATAMENTE ${nRefeicoes} refeição(ões) por dia, com os seguintes nomes nessa ordem: ${nomesRefeicoes.map((n, i) => `${i + 1}. ${n}`).join(', ')}. Não adicione nem remova refeições.`
    : `Distribua as refeições de forma prática e sustentável, nomeando cada uma.`;

  return `Crie um plano alimentar diário personalizado para uma pessoa com as seguintes características:\n\n${linhas.join('\n')}\n\n${instrucaoRefeicoes}\n\nPara cada refeição liste os alimentos, quantidades em gramas/ml e calorias estimadas. Forneça ao final: total de calorias diárias, macronutrientes (proteínas, carboidratos, gorduras) e dicas nutricionais específicas para o objetivo.`;
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
          content: 'Você é um nutricionista esportivo experiente. Crie planos alimentares personalizados, equilibrados e práticos baseados nas características e objetivos do cliente.',
        },
        { role: 'user', content: buildPrompt(perfil) },
      ],
      max_tokens: 2500,
    });

    const descricao = completion.choices[0].message.content;
    const caloriesMatch = descricao.match(/(\d{3,4})\s*(kcal|calorias)/i);
    const calorias = caloriesMatch ? caloriesMatch[1] : 'Ver plano';

    const plano = await PlanoAlimentar.create({ descricao, calorias, perfilId: perfilRaw.id });
    res.status(201).json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) return res.status(404).json({ error: 'Perfil físico não encontrado' });
    const planos = await PlanoAlimentar.findAll({
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
    const plano = await PlanoAlimentar.findOne({ where: { id: req.params.id, perfilId: perfil.id } });
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
    const deleted = await PlanoAlimentar.destroy({ where: { id: req.params.id, perfilId: perfil.id } });
    if (!deleted) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json({ message: 'Plano removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { gerar, listar, obter, deletar };
