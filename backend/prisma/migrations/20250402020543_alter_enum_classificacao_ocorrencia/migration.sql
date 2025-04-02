CREATE TYPE "ClassificacaoOcorrencia" AS ENUM ('seguranca_patrimonial', 'policiamento_escolar');

-- AlterTable
ALTER TABLE "ocorrencia"
ADD COLUMN     "classificacao" "ClassificacaoOcorrencia" NOT NULL;
