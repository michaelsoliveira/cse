/*
  Warnings:

  - Changed the type of `classificacao` on the `ocorrencia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "classificacaoocorrencia" AS ENUM ('seguranca_patrimonial', 'policiamento_escolar');

-- AlterTable
ALTER TABLE "ocorrencia"
ADD COLUMN     "classificacao" "classificacaoocorrencia" NOT NULL;
