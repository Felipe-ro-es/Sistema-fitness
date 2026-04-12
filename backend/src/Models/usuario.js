'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.belongsTo(models.Perfilfisico, { foreignKey: 'usuarioId' });
      Usuario.belongsTo(models.PlanoAlimentar, { foreignKey: 'usuarioId' });
      Usuario.belongsTo(models.PlanoTreino, { foreignKey: 'usuarioId' });
    }
  }
  Usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};