/*
  Warnings:

  - You are about to drop the column `municipio` on the `endereco` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "endereco" DROP COLUMN "municipio",
ADD COLUMN     "municipio_id" INTEGER;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
