-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "img_url" TEXT,
    "hora" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "recorrencia_tipo" TEXT NOT NULL,
    "data_unica" DATETIME,
    "recorrencia_ate" DATETIME,
    "filho_id" TEXT NOT NULL,
    "categoria_id" TEXT,
    CONSTRAINT "tasks_filho_id_fkey" FOREIGN KEY ("filho_id") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_recurrence_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dia" TEXT NOT NULL,
    "tarefa_id" TEXT NOT NULL,
    CONSTRAINT "task_recurrence_days_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
