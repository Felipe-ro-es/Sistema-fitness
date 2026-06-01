'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');
    await queryInterface.dropTable('PlanoAlimentars', { cascade: true });
    await queryInterface.dropTable('preferencias_alimentares', { cascade: true });
    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('PlanoAlimentars', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      descricao: Sequelize.TEXT,
      calorias: Sequelize.STRING,
      perfilId: Sequelize.INTEGER,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable('preferencias_alimentares', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      perfilId: Sequelize.INTEGER,
      refeicoes_dia: Sequelize.INTEGER,
      restricao_alimentar: Sequelize.TEXT,
      alimentos_nao_gosta: Sequelize.TEXT,
      alimentos_gosta: Sequelize.TEXT,
      dificuldade_dieta: Sequelize.STRING,
      cozinha_refeicoes: Sequelize.STRING,
      gasto_alimentacao: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
};
