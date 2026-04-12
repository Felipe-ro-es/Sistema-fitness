'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanoTreino extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlanoTreino.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      
    }
  }
  PlanoTreino.init({
    descricao: DataTypes.STRING,
    objetivo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PlanoTreino',
  });
  return PlanoTreino;
};