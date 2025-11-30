-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "img_url" TEXT
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "img_url" TEXT,
    "data_nascimento" DATETIME NOT NULL,
    "nivel_suporte" INTEGER NOT NULL,
    "observacoes" TEXT
);

-- CreateTable
CREATE TABLE "filho_responsavel" (
    "usuario_id" TEXT NOT NULL,
    "filho_id" TEXT NOT NULL,

    PRIMARY KEY ("usuario_id", "filho_id"),
    CONSTRAINT "filho_responsavel_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "filho_responsavel_filho_id_fkey" FOREIGN KEY ("filho_id") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
