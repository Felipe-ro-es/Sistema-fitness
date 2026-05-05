'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanoAlimentar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlanoAlimentar.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  PlanoAlimentar.init({
    descricao: DataTypes.TEXT,
    calorias: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlanoAlimentar',
  });
  return PlanoAlimentar;
};