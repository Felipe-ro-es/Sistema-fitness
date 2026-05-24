'use strict';

module.exports = {
  async up(queryInterface) {
    const q = queryInterface.sequelize;
    await q.query('PRAGMA foreign_keys = OFF');

    await q.query(`CREATE TABLE "Perfilfisicos_new" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "usuarioId" INTEGER,
      "fotos" TEXT,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    )`);
    await q.query(`INSERT INTO "Perfilfisicos_new" ("id","usuarioId","fotos","createdAt","updatedAt")
      SELECT "id","usuarioId","fotos","createdAt","updatedAt" FROM "Perfilfisicos"`);
    await q.query('DROP TABLE "Perfilfisicos"');
    await q.query('ALTER TABLE "Perfilfisicos_new" RENAME TO "Perfilfisicos"');

    await q.query(`CREATE TABLE "historico_progressos_new" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "peso" FLOAT,
      "obervacoes" VARCHAR(255),
      "perfilId" INTEGER,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      "fotos" TEXT,
      "data" DATE
    )`);
    await q.query(`INSERT INTO "historico_progressos_new" ("id","peso","obervacoes","perfilId","createdAt","updatedAt","fotos","data")
      SELECT "id","peso","obervacoes","perfilId","createdAt","updatedAt","fotos","data" FROM "historico_progressos"`);
    await q.query('DROP TABLE "historico_progressos"');
    await q.query('ALTER TABLE "historico_progressos_new" RENAME TO "historico_progressos"');

    await q.query('PRAGMA foreign_keys = ON');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');
    await queryInterface.addColumn('Perfilfisicos', 'foto', { type: Sequelize.STRING });
    await queryInterface.addColumn('historico_progressos', 'foto', { type: Sequelize.STRING });
    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
  },
};
