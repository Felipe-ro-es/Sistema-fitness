'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('historico_progressos', 'data', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('historico_progressos', 'data');
  },
};
