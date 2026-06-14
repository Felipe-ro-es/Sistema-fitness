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
    tem_lesao_desc: DataTypes.TEXT,
    dores_frequentes: DataTypes.STRING,
    dores_frequentes_desc: DataTypes.TEXT,
    limitacao_fisica: DataTypes.STRING,
    limitacao_fisica_desc: DataTypes.TEXT,
    exercicio_desconforto: DataTypes.STRING,
    exercicio_desconforto_desc: DataTypes.TEXT,
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
