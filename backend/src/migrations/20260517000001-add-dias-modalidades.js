'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Perfilfisicos', 'dias_disponiveis', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Perfilfisicos', 'modalidades', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Perfilfisicos', 'dias_disponiveis');
    await queryInterface.removeColumn('Perfilfisicos', 'modalidades');
  },
};
