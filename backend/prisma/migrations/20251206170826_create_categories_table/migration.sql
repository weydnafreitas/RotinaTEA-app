-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    CONSTRAINT "categories_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
