'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanoTreinos', 'perfilId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Perfilfisicos', key: 'id' },
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('PlanoTreinos', 'perfilId');
  },
};
