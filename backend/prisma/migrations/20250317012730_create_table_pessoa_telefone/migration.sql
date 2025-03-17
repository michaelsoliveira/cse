/*
  Warnings:

  - You are about to drop the column `id_telefone` on the `pessoa` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pessoa" DROP CONSTRAINT "pessoa_id_telefone_fkey";

-- AlterTable
ALTER TABLE "pessoa" DROP COLUMN "id_telefone",
ADD COLUMN     "email" VARCHAR;

-- CreateTable
CREATE TABLE "pessoa_telefone" (
    "id_pessoa" UUID NOT NULL,
    "id_telefone" UUID NOT NULL,

    CONSTRAINT "pessoa_telefone_pkey" PRIMARY KEY ("id_pessoa","id_telefone")
);

-- CreateIndex
CREATE INDEX "pessoa_telefone_id_pessoa_idx" ON "pessoa_telefone"("id_pessoa");

-- CreateIndex
CREATE INDEX "pessoa_telefone_id_telefone_idx" ON "pessoa_telefone"("id_telefone");

-- AddForeignKey
ALTER TABLE "pessoa_telefone" ADD CONSTRAINT "pessoa_telefone_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_telefone" ADD CONSTRAINT "pessoa_telefone_id_telefone_fkey" FOREIGN KEY ("id_telefone") REFERENCES "telefone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
