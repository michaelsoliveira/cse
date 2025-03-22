-- AlterTable
ALTER TABLE "endereco" ADD COLUMN     "complemento" TEXT;

-- AlterTable
ALTER TABLE "pessoa_fisica" ALTER COLUMN "data_nascimento" SET DATA TYPE DATE;
