/*
  Warnings:

  - You are about to drop the column `local` on the `ocorrencia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ocorrencia" DROP COLUMN "local",
ADD COLUMN     "comunicante_id" UUID;

-- CreateTable
CREATE TABLE "comunicante" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pessoa_id" UUID NOT NULL,

    CONSTRAINT "comunicante_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comunicante" ADD CONSTRAINT "comunicante_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_comunicante_id_fkey" FOREIGN KEY ("comunicante_id") REFERENCES "comunicante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
