-- CreateEnum
CREATE TYPE "meses" AS ENUM ('jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez');

-- CreateEnum
CREATE TYPE "status_avaliacao" AS ENUM ('muito_bom', 'bom', 'ruim', 'sem_acesso');

-- CreateTable
CREATE TABLE "avaliacao_mensal" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "mes" "meses" NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" "status_avaliacao" NOT NULL,
    "obs" TEXT,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "avaliacao_mensal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_mensal_unidade_id_mes_ano_key" ON "avaliacao_mensal"("unidade_id", "mes", "ano");

-- AddForeignKey
ALTER TABLE "avaliacao_mensal" ADD CONSTRAINT "avaliacao_mensal_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
