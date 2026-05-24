'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaudeRestricao extends Model {
    static associate(models) {
      SaudeRestricao.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
    }
  }
  SaudeRestricao.init({
    tem_lesao: DataTypes.STRING,
    dores_frequentes: DataTypes.STRING,
    limitacao_fisica: DataTypes.STRING,
    exercicio_desconforto: DataTypes.STRING,
    acompanhamento_medico: DataTypes.STRING,
    usa_medicamentos: DataTypes.STRING,
    parq: DataTypes.TEXT,
    horas_sono: DataTypes.FLOAT,
    nivel_estresse: DataTypes.STRING,
    agua_dia: DataTypes.STRING,
    consome_alcool: DataTypes.STRING,
    fuma: DataTypes.STRING,
    faz_cardio: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SaudeRestricao',
    tableName: 'saude_restricoes',
  });
  return SaudeRestricao;
};
