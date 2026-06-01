'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonalTrainer extends Model {
    static associate(models) {
      PersonalTrainer.hasMany(models.PlanoTreino, { foreignKey: 'personalId', as: 'Personal' });
      PersonalTrainer.hasMany(models.Perfilfisico, { foreignKey: 'personalId' });
    }
  }
  PersonalTrainer.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    cref: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PersonalTrainer',
  });
  return PersonalTrainer;
};
