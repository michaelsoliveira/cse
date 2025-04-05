/*
  Warnings:

  - Changed the type of `classificacao` on the `ocorrencia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "classificacao_ocorrencia" AS ENUM ('seguranca_patrimonial', 'policiamento_escolar');

-- AlterTable
ALTER TABLE "ocorrencia" DROP COLUMN "classificacao",
ADD COLUMN     "classificacao" "classificacao_ocorrencia" NOT NULL;

-- DropEnum
DROP TYPE "ClassificacaoOcorrencia";

-- DropEnum
DROP TYPE "classificacaoocorrencia";

-- CreateTable
CREATE TABLE "parametro" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT,
    "valor" TEXT,

    CONSTRAINT "parametro_pkey" PRIMARY KEY ("id")
);
