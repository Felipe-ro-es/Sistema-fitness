'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PreferenciasTreino extends Model {
    static associate(models) {
      PreferenciasTreino.belongsTo(models.Perfilfisico, { foreignKey: 'perfilId' });
    }
  }
  PreferenciasTreino.init({
    nivel_musculacao: DataTypes.STRING,
    tempo_treino: DataTypes.STRING,
    seguiu_dieta: DataTypes.STRING,
    sabe_executar_basicos: DataTypes.STRING,
    dias_treino_semana: DataTypes.INTEGER,
    tempo_por_treino: DataTypes.STRING,
    periodo_treino: DataTypes.STRING,
    nivel_atv_fisica: DataTypes.STRING,
    trabalho_postura: DataTypes.STRING,
    dias_disponiveis: DataTypes.TEXT,
    local_treino: DataTypes.STRING,
    equipamentos: DataTypes.TEXT,
    academia_completa: DataTypes.STRING,
    preferencia_treino: DataTypes.TEXT,
    modalidades: DataTypes.TEXT,
    preferencia_duracao_treino: DataTypes.STRING,
    gosta_cardio: DataTypes.STRING,
    treino_dividido: DataTypes.STRING,
    exercicios_favoritos: DataTypes.TEXT,
    exercicios_odeia: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'PreferenciasTreino',
    tableName: 'preferencias_treino',
  });
  return PreferenciasTreino;
};
