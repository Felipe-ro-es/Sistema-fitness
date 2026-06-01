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
      PlanoTreino.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
      PlanoTreino.belongsTo(models.PersonalTrainer, { foreignKey: 'personalId', as: 'Personal' });
    }
  }
  PlanoTreino.init({
    descricao: DataTypes.TEXT,
    objetivo: DataTypes.STRING,
    perfilId: DataTypes.INTEGER,
    personalId: DataTypes.INTEGER,
    feedback_usuario: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: 'pendente' }
  }, {
    sequelize,
    modelName: 'PlanoTreino',
  });
  return PlanoTreino;
};