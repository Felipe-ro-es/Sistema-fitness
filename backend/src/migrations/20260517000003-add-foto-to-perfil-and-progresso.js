'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Perfilfisicos', 'foto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('historico_progressos', 'foto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Perfilfisicos', 'foto');
    await queryInterface.removeColumn('historico_progressos', 'foto');
  },
};
