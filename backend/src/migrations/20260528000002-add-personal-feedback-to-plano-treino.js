'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanoTreinos', 'personalId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('PlanoTreinos', 'feedback_usuario', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('PlanoTreinos', 'personalId');
    await queryInterface.removeColumn('PlanoTreinos', 'feedback_usuario');
  },
};
