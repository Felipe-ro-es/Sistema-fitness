'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('PlanoTreinos', 'usuarioId');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanoTreinos', 'usuarioId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Usuarios', key: 'id' },
    });
  },
};
