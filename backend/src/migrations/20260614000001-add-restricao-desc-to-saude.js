'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('saude_restricoes', 'tem_lesao_desc', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'dores_frequentes_desc', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'limitacao_fisica_desc', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('saude_restricoes', 'exercicio_desconforto_desc', { type: Sequelize.TEXT, allowNull: true });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('saude_restricoes', 'tem_lesao_desc');
    await queryInterface.removeColumn('saude_restricoes', 'dores_frequentes_desc');
    await queryInterface.removeColumn('saude_restricoes', 'limitacao_fisica_desc');
    await queryInterface.removeColumn('saude_restricoes', 'exercicio_desconforto_desc');
  },
};
