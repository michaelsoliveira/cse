/*
  Warnings:

  - You are about to drop the column `nome` on the `origem_ocorrencia` table. All the data in the column will be lost.
  - Added the required column `pessoa_id` to the `origem_ocorrencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "origem_ocorrencia" DROP COLUMN "nome",
ADD COLUMN     "pessoa_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "origem_ocorrencia" ADD CONSTRAINT "origem_ocorrencia_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
