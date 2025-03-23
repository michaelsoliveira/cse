/*
  Warnings:

  - You are about to drop the column `local` on the `ocorrencia` table. All the data in the column will be lost.
  - Added the required column `classificacao` to the `ocorrencia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassificacaoOcorrencia" AS ENUM ('seguranca_patrimonial', 'seguranca_escolar');

-- AlterTable
ALTER TABLE "ocorrencia" DROP COLUMN "local",
ADD COLUMN     "classificacao" "ClassificacaoOcorrencia" NOT NULL,
ADD COLUMN     "origem_id" UUID;

-- CreateTable
CREATE TABLE "OrigemOcorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,

    CONSTRAINT "OrigemOcorrencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "OrigemOcorrencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
