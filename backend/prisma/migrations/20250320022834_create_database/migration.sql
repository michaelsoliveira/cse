-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "ZonaUnidade" AS ENUM ('rural', 'urbana');

-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('F', 'J');

-- CreateTable
CREATE TABLE "pessoa" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoPessoa" NOT NULL DEFAULT 'F',
    "email" VARCHAR,
    "telefone" TEXT,
    "endereco_id" UUID,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa_fisica" (
    "pessoa_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT,
    "rg" VARCHAR(30),
    "cpf" VARCHAR(14),
    "data_nascimento" TIMESTAMP(3),

    CONSTRAINT "pessoa_fisica_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "pessoa_juridica" (
    "pessoa_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_fantasia" VARCHAR(100) NOT NULL,
    "razao_social" VARCHAR(100),
    "inscricao_estadual" VARCHAR(30),
    "inscricao_federal" VARCHAR(30),
    "cnpj" VARCHAR(14),
    "data_constituicao" TIMESTAMP(3),

    CONSTRAINT "pessoa_juridica_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cep" VARCHAR(8),
    "logradouro" VARCHAR(60),
    "numero" TEXT,
    "municipio" VARCHAR(30),
    "bairro" VARCHAR(50),
    "estado_id" UUID,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidade_escolar" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zona" "ZonaUnidade" NOT NULL DEFAULT 'urbana',
    "inep" INTEGER,
    "pessoa_id" UUID,
    "diretor_id" UUID,

    CONSTRAINT "unidade_escolar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_registro" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,
    "cargo" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "responsavel_registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diretor" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pessoa_id" UUID,

    CONSTRAINT "diretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" DATE,
    "hora" TIME(0),
    "local" TEXT,
    "descricao" TEXT,
    "tipo_id" UUID NOT NULL,
    "responsavel_id" UUID,
    "user_id" UUID NOT NULL,
    "unidade_id" UUID NOT NULL,

    CONSTRAINT "ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envolvido" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "envolvido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envolvido_ocorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "ocorrencia_id" UUID,
    "envolvido_id" UUID,
    "papel" TEXT NOT NULL,

    CONSTRAINT "envolvido_ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexo_ocorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "ocorrencia_id" UUID NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "anexo_ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions_roles" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "PK_838ed6e68b01d6912fa682bedef" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_in" INTEGER NOT NULL,
    "token" VARCHAR NOT NULL,
    "id_user" UUID,

    CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "provider" VARCHAR,
    "id_provider" VARCHAR,
    "image" VARCHAR,
    "email_verified" TIMESTAMP(3),

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_permissions" (
    "user_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "PK_7f3736984cd8546a1e418005561" PRIMARY KEY ("user_id","permission_id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "uf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ddd" SMALLINT,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_ocorrencia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" TEXT NOT NULL,

    CONSTRAINT "tipo_ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_fisica_cpf_key" ON "pessoa_fisica"("cpf");

-- CreateIndex
CREATE INDEX "IDX_3309f5fa8d95935f0701027f2b" ON "permissions_roles"("permission_id");

-- CreateIndex
CREATE INDEX "IDX_e08f6859eaac8cbf7f087f64e2" ON "permissions_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "IDX_4de7d0b175f702be3be5527002" ON "users_permissions"("user_id");

-- CreateIndex
CREATE INDEX "IDX_b09b9a210c60f41ec7b453758e" ON "users_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles"("role_id");

-- CreateIndex
CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_fisica" ADD CONSTRAINT "pessoa_fisica_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_juridica" ADD CONSTRAINT "pessoa_juridica_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_escolar" ADD CONSTRAINT "unidade_escolar_diretor_id_fkey" FOREIGN KEY ("diretor_id") REFERENCES "diretor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_escolar" ADD CONSTRAINT "unidade_escolar_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel_registro" ADD CONSTRAINT "responsavel_registro_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diretor" ADD CONSTRAINT "diretor_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "responsavel_registro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "tipo_ocorrencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidade_escolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envolvido_ocorrencia" ADD CONSTRAINT "envolvido_ocorrencia_envolvido_id_fkey" FOREIGN KEY ("envolvido_id") REFERENCES "envolvido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envolvido_ocorrencia" ADD CONSTRAINT "envolvido_ocorrencia_ocorrencia_id_fkey" FOREIGN KEY ("ocorrencia_id") REFERENCES "ocorrencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo_ocorrencia" ADD CONSTRAINT "anexo_ocorrencia_ocorrencia_id_fkey" FOREIGN KEY ("ocorrencia_id") REFERENCES "ocorrencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions_roles" ADD CONSTRAINT "FK_3309f5fa8d95935f0701027f2bd" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions_roles" ADD CONSTRAINT "FK_e08f6859eaac8cbf7f087f64e2b" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_fd79923e4359a26a971f841fb5e" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_permissions" ADD CONSTRAINT "FK_4de7d0b175f702be3be55270023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_permissions" ADD CONSTRAINT "FK_b09b9a210c60f41ec7b453758e9" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
