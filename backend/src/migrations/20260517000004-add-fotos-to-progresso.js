'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('historico_progressos', 'fotos', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('historico_progressos', 'fotos');
  },
};
