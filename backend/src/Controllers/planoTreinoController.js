const OpenAI = require('openai');
const { PlanoTreino, Perfilfisico } = require('../models');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

function getOpenAI() {
  const envPath = path.join(__dirname, '../../.env');
  const parsed = dotenv.parse(fs.readFileSync(envPath));
  return new OpenAI({ apiKey: parsed.OPENAI_API_KEY });
}

const gerar = async (req, res) => {
  try {
    const perfil = await Perfilfisico.findOne({ where: { usuarioId: req.user.id } });
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil físico não encontrado. Preencha o questionário primeiro.' });
    }

    const parqAlerta = buildParqAlerta(perfil.parq);

    const prompt = `Crie um plano de treino semanal personalizado para uma pessoa com as seguintes características:
- Peso: ${perfil.peso}kg
- Altura: ${perfil.altura}cm
- Idade: ${perfil.idade} anos
- Objetivo: ${perfil.objetivo}
- Nível de atividade física: ${perfil.nivel_atv_fisica}
${perfil.obervacoes ? `- Observações: ${perfil.obervacoes}` : ''}
${parqAlerta ? `\nAVISO PAR-Q (respostas SIM do questionário de prontidão física):\n${parqAlerta}\nAdapte o plano considerando essas condições, priorizando segurança e exercícios de baixo impacto onde necessário.` : ''}

Formate o plano com os dias da semana (Segunda a Domingo), para cada dia liste: nome do treino, exercícios com séries, repetições e tempo de descanso. Inclua dicas de aquecimento e alongamento. Seja detalhado e prático.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer experiente e certificado. Crie planos de treino personalizados, seguros e eficazes baseados nas características do aluno.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2500,
    });

    const descricao = completion.choices[0].message.content;
    const plano = await PlanoTreino.create({ descricao, objetivo: perfil.objetivo, usuarioId: req.user.id });
    res.status(201).json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const planos = await PlanoTreino.findAll({
      where: { usuarioId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obter = async (req, res) => {
  try {
    const plano = await PlanoTreino.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
    if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletar = async (req, res) => {
  try {
    const deleted = await PlanoTreino.destroy({ where: { id: req.params.id, usuarioId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json({ message: 'Plano removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const PARQ_PERGUNTAS = [
  'Seu médico já disse que você possui algum problema cardíaco',
  'Você sente dores no peito ao praticar atividade física',
  'No último mês sentiu dores no peito sem estar praticando atividade física',
  'Você perde o equilíbrio por tontura ou já perdeu a consciência',
  'Possui problema ósseo ou articular que pode piorar com atividade física',
  'Seu médico prescreve medicamento para pressão arterial ou coração',
  'Existe outro motivo pelo qual não deveria praticar atividade física',
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

module.exports = { gerar, listar, obter, deletar };
