'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Perfilfisico extends Model {
    static associate(models) {
      Perfilfisico.hasMany(models.historico_progresso, { foreignKey: 'perfilId' });
      Perfilfisico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Perfilfisico.hasMany(models.PlanoAlimentar, { foreignKey: 'perfilId' });
      Perfilfisico.hasMany(models.PlanoTreino, { foreignKey: 'perfilId' });
    }
  }
  Perfilfisico.init({
    // step 2 - existentes
    peso: DataTypes.FLOAT,
    altura: DataTypes.FLOAT,
    idade: DataTypes.INTEGER,
    obervacoes: DataTypes.STRING,
    // step 1
    objetivo: DataTypes.STRING,
    prazo_objetivo: DataTypes.STRING,
    resultado_satisfatorio: DataTypes.TEXT,
    tentou_antes: DataTypes.STRING,
    // step 2 - novos
    sexo: DataTypes.STRING,
    peso_desejado: DataTypes.FLOAT,
    percentual_gordura: DataTypes.FLOAT,
    medidas_corporais: DataTypes.TEXT,
    // step 3
    nivel_musculacao: DataTypes.STRING,
    tempo_treino: DataTypes.STRING,
    seguiu_dieta: DataTypes.STRING,
    sabe_executar_basicos: DataTypes.STRING,
    // step 4
    dias_treino_semana: DataTypes.INTEGER,
    tempo_por_treino: DataTypes.STRING,
    periodo_treino: DataTypes.STRING,
    nivel_atv_fisica: DataTypes.STRING,
    trabalho_postura: DataTypes.STRING,
    // step 5
    local_treino: DataTypes.STRING,
    equipamentos: DataTypes.TEXT,
    academia_completa: DataTypes.STRING,
    preferencia_treino: DataTypes.TEXT,
    dias_disponiveis: DataTypes.TEXT,
    modalidades: DataTypes.TEXT,
    // step 6
    tem_lesao: DataTypes.STRING,
    dores_frequentes: DataTypes.STRING,
    limitacao_fisica: DataTypes.STRING,
    exercicio_desconforto: DataTypes.STRING,
    acompanhamento_medico: DataTypes.STRING,
    usa_medicamentos: DataTypes.STRING,
    parq: DataTypes.TEXT,
    // step 7
    refeicoes_dia: DataTypes.INTEGER,
    restricao_alimentar: DataTypes.TEXT,
    alimentos_nao_gosta: DataTypes.TEXT,
    alimentos_gosta: DataTypes.TEXT,
    dificuldade_dieta: DataTypes.STRING,
    cozinha_refeicoes: DataTypes.STRING,
    gasto_alimentacao: DataTypes.STRING,
    // step 8
    horas_sono: DataTypes.FLOAT,
    nivel_estresse: DataTypes.STRING,
    agua_dia: DataTypes.STRING,
    consome_alcool: DataTypes.STRING,
    fuma: DataTypes.STRING,
    faz_cardio: DataTypes.STRING,
    // step 9
    preferencia_duracao_treino: DataTypes.STRING,
    gosta_cardio: DataTypes.STRING,
    treino_dividido: DataTypes.STRING,
    exercicios_favoritos: DataTypes.TEXT,
    exercicios_odeia: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Perfilfisico',
  });
  return Perfilfisico;
};
