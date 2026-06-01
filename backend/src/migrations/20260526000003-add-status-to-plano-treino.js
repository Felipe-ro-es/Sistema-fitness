'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanoTreinos', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pendente',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('PlanoTreinos', 'status');
  },
};
