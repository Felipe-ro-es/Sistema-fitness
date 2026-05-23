'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historico_progresso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      historico_progresso.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
      
    }
  }
  historico_progresso.init({
    peso: DataTypes.FLOAT,
    obervacoes: DataTypes.STRING,
    foto: DataTypes.STRING,
    fotos: DataTypes.TEXT,
    data: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'historico_progresso',
  });
  return historico_progresso;
};