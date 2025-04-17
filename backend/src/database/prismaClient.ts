import { PrismaClient } from "@prisma/client";
import { avaliacaoMensalExtension } from "../../prisma/extensions/avaliacao-mensal-extension";

const prismaClient = new PrismaClient();

const prisma = prismaClient.$extends(avaliacaoMensalExtension)

export { prismaClient }