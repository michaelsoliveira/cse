/*
  Warnings:

  - The `tipo` column on the `pessoa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `zona` column on the `unidade_escolar` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "acionamento_ocorrencia" AS ENUM ('botao_alerta', 'numero_190');

-- CreateEnum
CREATE TYPE "zona_unidade" AS ENUM ('rural', 'urbana');

-- CreateEnum
CREATE TYPE "tipo_pessoa" AS ENUM ('F', 'J');

-- AlterTable
ALTER TABLE "ocorrencia" ADD COLUMN     "acionamento" "acionamento_ocorrencia";

-- AlterTable
ALTER TABLE "pessoa" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "tipo_pessoa" NOT NULL DEFAULT 'F';

-- AlterTable
ALTER TABLE "unidade_escolar" DROP COLUMN "zona",
ADD COLUMN     "zona" "zona_unidade" NOT NULL DEFAULT 'urbana';

-- DropEnum
DROP TYPE "TipoPessoa";

-- DropEnum
DROP TYPE "ZonaUnidade";
