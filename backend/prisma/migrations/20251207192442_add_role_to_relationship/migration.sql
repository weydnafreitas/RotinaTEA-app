-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_filho_responsavel" (
    "usuario_id" TEXT NOT NULL,
    "filho_id" TEXT NOT NULL,
    "funcao" TEXT NOT NULL DEFAULT 'ADMIN',

    PRIMARY KEY ("usuario_id", "filho_id"),
    CONSTRAINT "filho_responsavel_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "filho_responsavel_filho_id_fkey" FOREIGN KEY ("filho_id") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_filho_responsavel" ("filho_id", "usuario_id") SELECT "filho_id", "usuario_id" FROM "filho_responsavel";
DROP TABLE "filho_responsavel";
ALTER TABLE "new_filho_responsavel" RENAME TO "filho_responsavel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
