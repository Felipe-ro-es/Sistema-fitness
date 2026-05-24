'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date().toISOString();

    await queryInterface.createTable('dados_fisicos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      perfilId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'Perfilfisicos', key: 'id' } },
      objetivo: { type: Sequelize.STRING },
      prazo_objetivo: { type: Sequelize.STRING },
      resultado_satisfatorio: { type: Sequelize.TEXT },
      tentou_antes: { type: Sequelize.STRING },
      peso: { type: Sequelize.FLOAT },
      altura: { type: Sequelize.FLOAT },
      idade: { type: Sequelize.INTEGER },
      sexo: { type: Sequelize.STRING },
      peso_desejado: { type: Sequelize.FLOAT },
      percentual_gordura: { type: Sequelize.FLOAT },
      medidas_corporais: { type: Sequelize.TEXT },
      obervacoes: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('preferencias_treino', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      perfilId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'Perfilfisicos', key: 'id' } },
      nivel_musculacao: { type: Sequelize.STRING },
      tempo_treino: { type: Sequelize.STRING },
      seguiu_dieta: { type: Sequelize.STRING },
      sabe_executar_basicos: { type: Sequelize.STRING },
      dias_treino_semana: { type: Sequelize.INTEGER },
      tempo_por_treino: { type: Sequelize.STRING },
      periodo_treino: { type: Sequelize.STRING },
      nivel_atv_fisica: { type: Sequelize.STRING },
      trabalho_postura: { type: Sequelize.STRING },
      dias_disponiveis: { type: Sequelize.TEXT },
      local_treino: { type: Sequelize.STRING },
      equipamentos: { type: Sequelize.TEXT },
      academia_completa: { type: Sequelize.STRING },
      preferencia_treino: { type: Sequelize.TEXT },
      modalidades: { type: Sequelize.TEXT },
      preferencia_duracao_treino: { type: Sequelize.STRING },
      gosta_cardio: { type: Sequelize.STRING },
      treino_dividido: { type: Sequelize.STRING },
      exercicios_favoritos: { type: Sequelize.TEXT },
      exercicios_odeia: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('saude_restricoes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      perfilId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'Perfilfisicos', key: 'id' } },
      tem_lesao: { type: Sequelize.STRING },
      dores_frequentes: { type: Sequelize.STRING },
      limitacao_fisica: { type: Sequelize.STRING },
      exercicio_desconforto: { type: Sequelize.STRING },
      acompanhamento_medico: { type: Sequelize.STRING },
      usa_medicamentos: { type: Sequelize.STRING },
      parq: { type: Sequelize.TEXT },
      horas_sono: { type: Sequelize.FLOAT },
      nivel_estresse: { type: Sequelize.STRING },
      agua_dia: { type: Sequelize.STRING },
      consome_alcool: { type: Sequelize.STRING },
      fuma: { type: Sequelize.STRING },
      faz_cardio: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable('preferencias_alimentares', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      perfilId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'Perfilfisicos', key: 'id' } },
      refeicoes_dia: { type: Sequelize.INTEGER },
      restricao_alimentar: { type: Sequelize.TEXT },
      alimentos_nao_gosta: { type: Sequelize.TEXT },
      alimentos_gosta: { type: Sequelize.TEXT },
      dificuldade_dieta: { type: Sequelize.STRING },
      cozinha_refeicoes: { type: Sequelize.STRING },
      gasto_alimentacao: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    const [perfis] = await queryInterface.sequelize.query('SELECT * FROM Perfilfisicos');

    if (perfis.length > 0) {
      await queryInterface.bulkInsert('dados_fisicos', perfis.map(p => ({
        perfilId: p.id,
        objetivo: p.objetivo || null,
        prazo_objetivo: p.prazo_objetivo || null,
        resultado_satisfatorio: p.resultado_satisfatorio || null,
        tentou_antes: p.tentou_antes || null,
        peso: p.peso || null,
        altura: p.altura || null,
        idade: p.idade || null,
        sexo: p.sexo || null,
        peso_desejado: p.peso_desejado || null,
        percentual_gordura: p.percentual_gordura || null,
        medidas_corporais: p.medidas_corporais || null,
        obervacoes: p.obervacoes || null,
        createdAt: now,
        updatedAt: now,
      })));

      await queryInterface.bulkInsert('preferencias_treino', perfis.map(p => ({
        perfilId: p.id,
        nivel_musculacao: p.nivel_musculacao || null,
        tempo_treino: p.tempo_treino || null,
        seguiu_dieta: p.seguiu_dieta || null,
        sabe_executar_basicos: p.sabe_executar_basicos || null,
        dias_treino_semana: p.dias_treino_semana || null,
        tempo_por_treino: p.tempo_por_treino || null,
        periodo_treino: p.periodo_treino || null,
        nivel_atv_fisica: p.nivel_atv_fisica || null,
        trabalho_postura: p.trabalho_postura || null,
        dias_disponiveis: p.dias_disponiveis || null,
        local_treino: p.local_treino || null,
        equipamentos: p.equipamentos || null,
        academia_completa: p.academia_completa || null,
        preferencia_treino: p.preferencia_treino || null,
        modalidades: p.modalidades || null,
        preferencia_duracao_treino: p.preferencia_duracao_treino || null,
        gosta_cardio: p.gosta_cardio || null,
        treino_dividido: p.treino_dividido || null,
        exercicios_favoritos: p.exercicios_favoritos || null,
        exercicios_odeia: p.exercicios_odeia || null,
        createdAt: now,
        updatedAt: now,
      })));

      await queryInterface.bulkInsert('saude_restricoes', perfis.map(p => ({
        perfilId: p.id,
        tem_lesao: p.tem_lesao || null,
        dores_frequentes: p.dores_frequentes || null,
        limitacao_fisica: p.limitacao_fisica || null,
        exercicio_desconforto: p.exercicio_desconforto || null,
        acompanhamento_medico: p.acompanhamento_medico || null,
        usa_medicamentos: p.usa_medicamentos || null,
        parq: p.parq || null,
        horas_sono: p.horas_sono || null,
        nivel_estresse: p.nivel_estresse || null,
        agua_dia: p.agua_dia || null,
        consome_alcool: p.consome_alcool || null,
        fuma: p.fuma || null,
        faz_cardio: p.faz_cardio || null,
        createdAt: now,
        updatedAt: now,
      })));

      await queryInterface.bulkInsert('preferencias_alimentares', perfis.map(p => ({
        perfilId: p.id,
        refeicoes_dia: p.refeicoes_dia || null,
        restricao_alimentar: p.restricao_alimentar || null,
        alimentos_nao_gosta: p.alimentos_nao_gosta || null,
        alimentos_gosta: p.alimentos_gosta || null,
        dificuldade_dieta: p.dificuldade_dieta || null,
        cozinha_refeicoes: p.cozinha_refeicoes || null,
        gasto_alimentacao: p.gasto_alimentacao || null,
        createdAt: now,
        updatedAt: now,
      })));
    }

    // Recria Perfilfisicos apenas com os campos essenciais
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');
    await queryInterface.sequelize.query(`
      CREATE TABLE Perfilfisicos_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuarioId INTEGER REFERENCES Usuarios(id),
        foto TEXT,
        fotos TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO Perfilfisicos_new (id, usuarioId, foto, fotos, createdAt, updatedAt)
      SELECT id, usuarioId, foto, fotos, createdAt, updatedAt FROM Perfilfisicos
    `);
    await queryInterface.dropTable('Perfilfisicos');
    await queryInterface.sequelize.query('ALTER TABLE Perfilfisicos_new RENAME TO Perfilfisicos');
    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
  },

  async down(queryInterface, Sequelize) {
    const now = new Date().toISOString();

    await queryInterface.sequelize.query(`
      CREATE TABLE Perfilfisicos_restored (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuarioId INTEGER REFERENCES Usuarios(id),
        foto TEXT,
        fotos TEXT,
        objetivo TEXT,
        prazo_objetivo TEXT,
        resultado_satisfatorio TEXT,
        tentou_antes TEXT,
        peso REAL,
        altura REAL,
        idade INTEGER,
        sexo TEXT,
        peso_desejado REAL,
        percentual_gordura REAL,
        medidas_corporais TEXT,
        obervacoes TEXT,
        nivel_musculacao TEXT,
        tempo_treino TEXT,
        seguiu_dieta TEXT,
        sabe_executar_basicos TEXT,
        dias_treino_semana INTEGER,
        tempo_por_treino TEXT,
        periodo_treino TEXT,
        nivel_atv_fisica TEXT,
        trabalho_postura TEXT,
        dias_disponiveis TEXT,
        local_treino TEXT,
        equipamentos TEXT,
        academia_completa TEXT,
        preferencia_treino TEXT,
        modalidades TEXT,
        preferencia_duracao_treino TEXT,
        gosta_cardio TEXT,
        treino_dividido TEXT,
        exercicios_favoritos TEXT,
        exercicios_odeia TEXT,
        tem_lesao TEXT,
        dores_frequentes TEXT,
        limitacao_fisica TEXT,
        exercicio_desconforto TEXT,
        acompanhamento_medico TEXT,
        usa_medicamentos TEXT,
        parq TEXT,
        horas_sono REAL,
        nivel_estresse TEXT,
        agua_dia TEXT,
        consome_alcool TEXT,
        fuma TEXT,
        faz_cardio TEXT,
        refeicoes_dia INTEGER,
        restricao_alimentar TEXT,
        alimentos_nao_gosta TEXT,
        alimentos_gosta TEXT,
        dificuldade_dieta TEXT,
        cozinha_refeicoes TEXT,
        gasto_alimentacao TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    await queryInterface.sequelize.query(`
      INSERT INTO Perfilfisicos_restored
      SELECT
        p.id, p.usuarioId, p.foto, p.fotos,
        d.objetivo, d.prazo_objetivo, d.resultado_satisfatorio, d.tentou_antes,
        d.peso, d.altura, d.idade, d.sexo, d.peso_desejado, d.percentual_gordura,
        d.medidas_corporais, d.obervacoes,
        t.nivel_musculacao, t.tempo_treino, t.seguiu_dieta, t.sabe_executar_basicos,
        t.dias_treino_semana, t.tempo_por_treino, t.periodo_treino, t.nivel_atv_fisica,
        t.trabalho_postura, t.dias_disponiveis, t.local_treino, t.equipamentos,
        t.academia_completa, t.preferencia_treino, t.modalidades,
        t.preferencia_duracao_treino, t.gosta_cardio, t.treino_dividido,
        t.exercicios_favoritos, t.exercicios_odeia,
        s.tem_lesao, s.dores_frequentes, s.limitacao_fisica, s.exercicio_desconforto,
        s.acompanhamento_medico, s.usa_medicamentos, s.parq,
        s.horas_sono, s.nivel_estresse, s.agua_dia, s.consome_alcool, s.fuma, s.faz_cardio,
        a.refeicoes_dia, a.restricao_alimentar, a.alimentos_nao_gosta, a.alimentos_gosta,
        a.dificuldade_dieta, a.cozinha_refeicoes, a.gasto_alimentacao,
        p.createdAt, p.updatedAt
      FROM Perfilfisicos p
      LEFT JOIN dados_fisicos d ON d.perfilId = p.id
      LEFT JOIN preferencias_treino t ON t.perfilId = p.id
      LEFT JOIN saude_restricoes s ON s.perfilId = p.id
      LEFT JOIN preferencias_alimentares a ON a.perfilId = p.id
    `);

    await queryInterface.dropTable('Perfilfisicos');
    await queryInterface.sequelize.query('ALTER TABLE Perfilfisicos_restored RENAME TO Perfilfisicos');

    await queryInterface.dropTable('dados_fisicos');
    await queryInterface.dropTable('preferencias_treino');
    await queryInterface.dropTable('saude_restricoes');
    await queryInterface.dropTable('preferencias_alimentares');
  },
};
