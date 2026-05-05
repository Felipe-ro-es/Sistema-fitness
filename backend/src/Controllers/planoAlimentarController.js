const OpenAI = require('openai');
const { PlanoAlimentar, Perfilfisico } = require('../models');
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

    const prompt = `Crie um plano alimentar diário personalizado para uma pessoa com as seguintes características:
- Peso: ${perfil.peso}kg
- Altura: ${perfil.altura}cm
- Idade: ${perfil.idade} anos
- Objetivo: ${perfil.objetivo}
- Nível de atividade física: ${perfil.nivel_atv_fisica}
${perfil.obervacoes ? `- Observações/Restrições: ${perfil.obervacoes}` : ''}
${parqAlerta ? `\nAVISO PAR-Q (respostas SIM do questionário de prontidão física):\n${parqAlerta}\nAdapte o plano alimentar considerando essas condições de saúde.` : ''}

Inclua: café da manhã, lanche da manhã, almoço, lanche da tarde, jantar e ceia (se necessário). Para cada refeição liste os alimentos, quantidades em gramas/ml e calorias estimadas. Forneça o total de calorias diárias, macronutrientes (proteínas, carboidratos, gorduras) e dicas nutricionais específicas para o objetivo.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista esportivo experiente. Crie planos alimentares personalizados, equilibrados e práticos baseados nas características e objetivos do cliente.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2500,
    });

    const descricao = completion.choices[0].message.content;

    const caloriesMatch = descricao.match(/(\d{3,4})\s*(kcal|calorias)/i);
    const calorias = caloriesMatch ? caloriesMatch[1] : 'Ver plano';

    const plano = await PlanoAlimentar.create({
      descricao,
      calorias,
      usuarioId: req.user.id,
    });
    res.status(201).json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const planos = await PlanoAlimentar.findAll({
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
    const plano = await PlanoAlimentar.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
    if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletar = async (req, res) => {
  try {
    const deleted = await PlanoAlimentar.destroy({ where: { id: req.params.id, usuarioId: req.user.id } });
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

module.exports = { gerar, listar, obter, deletar };
