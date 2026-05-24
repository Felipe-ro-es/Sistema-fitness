'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Perfilfisico extends Model {
    static associate(models) {
      Perfilfisico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Perfilfisico.hasMany(models.historico_progresso, { foreignKey: 'perfilId' });
      Perfilfisico.hasMany(models.PlanoAlimentar, { foreignKey: 'perfilId' });
      Perfilfisico.hasMany(models.PlanoTreino, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.DadosFisico, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.PreferenciasTreino, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.SaudeRestricao, { foreignKey: 'perfilId' });
      Perfilfisico.hasOne(models.PreferenciasAlimentar, { foreignKey: 'perfilId' });
    }
  }
  Perfilfisico.init({
    fotos: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Perfilfisico',
  });
  return Perfilfisico;
};
