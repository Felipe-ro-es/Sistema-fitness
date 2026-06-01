'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('dados_fisicos', 'data_nascimento', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.removeColumn('dados_fisicos', 'prazo_objetivo');
    await queryInterface.removeColumn('dados_fisicos', 'tentou_antes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('dados_fisicos', 'data_nascimento');
    await queryInterface.addColumn('dados_fisicos', 'prazo_objetivo', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('dados_fisicos', 'tentou_antes', { type: Sequelize.STRING, allowNull: true });
  },
};
