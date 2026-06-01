'use strict';

const COLUMNS = [
  ['sexo', 'STRING'],
  ['peso_desejado', 'FLOAT'],
  ['percentual_gordura', 'FLOAT'],
  ['medidas_corporais', 'TEXT'],
  ['prazo_objetivo', 'STRING'],
  ['resultado_satisfatorio', 'TEXT'],
  ['tentou_antes', 'STRING'],
  ['nivel_musculacao', 'STRING'],
  ['tempo_treino', 'STRING'],
  ['seguiu_dieta', 'STRING'],
  ['sabe_executar_basicos', 'STRING'],
  ['dias_treino_semana', 'INTEGER'],
  ['tempo_por_treino', 'STRING'],
  ['periodo_treino', 'STRING'],
  ['trabalho_postura', 'STRING'],
  ['local_treino', 'STRING'],
  ['equipamentos', 'TEXT'],
  ['academia_completa', 'STRING'],
  ['preferencia_treino', 'TEXT'],
  ['tem_lesao', 'STRING'],
  ['dores_frequentes', 'STRING'],
  ['limitacao_fisica', 'STRING'],
  ['exercicio_desconforto', 'STRING'],
  ['acompanhamento_medico', 'STRING'],
  ['usa_medicamentos', 'STRING'],
  ['horas_sono', 'FLOAT'],
  ['nivel_estresse', 'STRING'],
  ['agua_dia', 'STRING'],
  ['consome_alcool', 'STRING'],
  ['fuma', 'STRING'],
  ['faz_cardio', 'STRING'],
  ['preferencia_duracao_treino', 'STRING'],
  ['gosta_cardio', 'STRING'],
  ['treino_dividido', 'STRING'],
  ['exercicios_favoritos', 'TEXT'],
  ['exercicios_odeia', 'TEXT'],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const [name, type] of COLUMNS) {
      await queryInterface.addColumn('Perfilfisicos', name, {
        type: Sequelize[type],
        allowNull: true,
      });
    }
  },
  async down(queryInterface) {
    for (const [name] of COLUMNS) {
      await queryInterface.removeColumn('Perfilfisicos', name);
    }
  },
};
