/*
  Warnings:

  - You are about to drop the column `id_endereco` on the `unidade_escolar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "unidade_escolar" DROP CONSTRAINT "unidade_escolar_id_endereco_fkey";

-- AlterTable
ALTER TABLE "unidade_escolar" DROP COLUMN "id_endereco",
ADD COLUMN     "nome" TEXT;
