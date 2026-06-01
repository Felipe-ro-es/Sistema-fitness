'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');

    for (const col of ['horas_sono', 'nivel_estresse', 'agua_dia', 'consome_alcool', 'fuma', 'faz_cardio']) {
      await queryInterface.removeColumn('saude_restricoes', col);
    }

    for (const col of ['seguiu_dieta', 'trabalho_postura']) {
      await queryInterface.removeColumn('preferencias_treino', col);
    }

    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');

    await queryInterface.addColumn('saude_restricoes', 'horas_sono', { type: Sequelize.FLOAT, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'nivel_estresse', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'agua_dia', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'consome_alcool', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'fuma', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'faz_cardio', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('preferencias_treino', 'seguiu_dieta', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('preferencias_treino', 'trabalho_postura', { type: Sequelize.STRING, allowNull: true });

    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
  },
};
