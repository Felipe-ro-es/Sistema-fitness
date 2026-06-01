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
  }, {
    sequelize,
    modelName: 'SaudeRestricao',
    tableName: 'saude_restricoes',
  });
  return SaudeRestricao;
};
