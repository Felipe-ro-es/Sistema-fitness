'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DadosFisico extends Model {
    static associate(models) {
      DadosFisico.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
    }
  }
  DadosFisico.init({
    objetivo: DataTypes.STRING,
    prazo_objetivo: DataTypes.STRING,
    resultado_satisfatorio: DataTypes.TEXT,
    tentou_antes: DataTypes.STRING,
    peso: DataTypes.FLOAT,
    altura: DataTypes.FLOAT,
    idade: DataTypes.INTEGER,
    sexo: DataTypes.STRING,
    peso_desejado: DataTypes.FLOAT,
    percentual_gordura: DataTypes.FLOAT,
    medidas_corporais: DataTypes.TEXT,
    obervacoes: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'DadosFisico',
    tableName: 'dados_fisicos',
  });
  return DadosFisico;
};
