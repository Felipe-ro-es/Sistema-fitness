'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Perfilfisico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Perfilfisico.hasMany(models.HistoricoProgresso, { foreignKey: 'perfilId' });
        Perfilfisico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
        
    }
  }
  Perfilfisico.init({
    peso: DataTypes.FLOAT,
    altura: DataTypes.FLOAT,
    idade: DataTypes.INTEGER,
    objetivo: DataTypes.STRING,
    obervacoes: DataTypes.STRING,
    nivel_atv_fisica: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Perfilfisico',
  });
  return Perfilfisico;
};