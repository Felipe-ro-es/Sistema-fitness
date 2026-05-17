'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanoAlimentars', 'perfilId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Perfilfisicos', key: 'id' },
    });
    await queryInterface.addColumn('PlanoTreinos', 'perfilId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Perfilfisicos', key: 'id' },
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('PlanoAlimentars', 'perfilId');
    await queryInterface.removeColumn('PlanoTreinos', 'perfilId');
  },
};
