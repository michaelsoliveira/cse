/*
  Warnings:

  - You are about to drop the `origem_ocorrencia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ocorrencia" DROP CONSTRAINT "ocorrencia_comunicante_id_fkey";

-- DropForeignKey
ALTER TABLE "origem_ocorrencia" DROP CONSTRAINT "origem_ocorrencia_pessoa_id_fkey";

-- DropTable
DROP TABLE "origem_ocorrencia";

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
