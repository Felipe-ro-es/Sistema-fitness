'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Perfilfisicos', 'fotos', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Perfilfisicos', 'fotos');
  },
};
