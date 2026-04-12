'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Perfilfisicos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      peso: {
        type: Sequelize.FLOAT
      },
      altura: {
        type: Sequelize.FLOAT
      },
      idade: {
        type: Sequelize.INTEGER
      },
      objetivo: {
        type: Sequelize.STRING
      },
      obervacoes: {
        type: Sequelize.STRING
      },
      nivel_atv_fisica: {
        type: Sequelize.STRING
      },
       usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Perfilfisicos');
  }
};