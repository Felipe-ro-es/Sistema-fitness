'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Perfilfisico extends Model {
    static associate(models) {
      Perfilfisico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Perfilfisico.belongsTo(models.PersonalTrainer, { foreignKey: 'personalId', as: 'PersonalResponsavel' });
      Perfilfisico.hasMany(models.historico_progresso, { foreignKey: 'perfilId' });
      Perfilfisico.hasMany(models.PlanoTreino, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.DadosFisico, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.PreferenciasTreino, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.SaudeRestricao, { foreignKey: 'perfilId' });
    }
  }
  Perfilfisico.init({
    fotos: DataTypes.TEXT,
    personalId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Perfilfisico',
  });
  return Perfilfisico;
};
