/*
  Warnings:

  - You are about to drop the column `origem_id` on the `ocorrencia` table. All the data in the column will be lost.
  - You are about to drop the `OrigemOcorrencia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ocorrencia" DROP CONSTRAINT "ocorrencia_origem_id_fkey";

-- AlterTable
ALTER TABLE "ocorrencia" DROP COLUMN "origem_id",
ADD COLUMN     "comunicante_id" UUID;

-- DropTable
DROP TABLE "OrigemOcorrencia";

-- CreateTable
CREATE TABLE "origem_ocorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,

    CONSTRAINT "origem_ocorrencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_comunicante_id_fkey" FOREIGN KEY ("comunicante_id") REFERENCES "origem_ocorrencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
