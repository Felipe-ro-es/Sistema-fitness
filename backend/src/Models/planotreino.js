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
    descricao: DataTypes.TEXT,
    objetivo: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlanoTreino',
  });
  return PlanoTreino;
};