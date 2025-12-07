-- CreateTable
CREATE TABLE "filho_informacao_tecnica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filho_id" TEXT NOT NULL,
    CONSTRAINT "filho_informacao_tecnica_filho_id_fkey" FOREIGN KEY ("filho_id") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
