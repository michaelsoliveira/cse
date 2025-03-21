/*
  Warnings:

  - The `estado_id` column on the `endereco` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `estado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `estado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ddd` column on the `estado` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- DropForeignKey
ALTER TABLE "endereco" DROP CONSTRAINT "endereco_estado_id_fkey";

-- AlterTable
ALTER TABLE "endereco" ADD COLUMN     "lat_lon" Point,
DROP COLUMN "estado_id",
ADD COLUMN     "estado_id" INTEGER;

-- AlterTable
ALTER TABLE "estado" DROP CONSTRAINT "estado_pkey",
ADD COLUMN     "ibge" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "ddd",
ADD COLUMN     "ddd" JSONB,
ADD CONSTRAINT "estado_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "municipio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ibge" INTEGER,
    "lat_lon" Point,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipio" ADD CONSTRAINT "municipio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
