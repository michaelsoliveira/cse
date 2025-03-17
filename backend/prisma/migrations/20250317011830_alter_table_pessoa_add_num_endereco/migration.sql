-- AlterTable
ALTER TABLE "pessoa" ADD COLUMN     "numero_endereco" TEXT;

-- AlterTable
ALTER TABLE "pessoa_juridica" ALTER COLUMN "razao_social" DROP NOT NULL;
