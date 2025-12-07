-- CreateTable
CREATE TABLE "anotacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filho_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "media_url" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "anotacoes_filho_id_fkey" FOREIGN KEY ("filho_id") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
