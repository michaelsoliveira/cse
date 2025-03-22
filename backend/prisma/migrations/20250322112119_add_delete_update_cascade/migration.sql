-- DropForeignKey
ALTER TABLE "pessoa_juridica" DROP CONSTRAINT "pessoa_juridica_pessoa_id_fkey";

-- DropForeignKey
ALTER TABLE "unidade_escolar" DROP CONSTRAINT "unidade_escolar_pessoa_id_fkey";

-- AddForeignKey
ALTER TABLE "pessoa_juridica" ADD CONSTRAINT "pessoa_juridica_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_escolar" ADD CONSTRAINT "unidade_escolar_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
