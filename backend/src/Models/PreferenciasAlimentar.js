'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PreferenciasAlimentar extends Model {
    static associate(models) {
      PreferenciasAlimentar.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
    }
  }
  PreferenciasAlimentar.init({
    refeicoes_dia: DataTypes.INTEGER,
    restricao_alimentar: DataTypes.TEXT,
    alimentos_nao_gosta: DataTypes.TEXT,
    alimentos_gosta: DataTypes.TEXT,
    dificuldade_dieta: DataTypes.STRING,
    cozinha_refeicoes: DataTypes.STRING,
    gasto_alimentacao: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PreferenciasAlimentar',
    tableName: 'preferencias_alimentares',
  });
  return PreferenciasAlimentar;
};
