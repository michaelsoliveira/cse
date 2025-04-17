import { PrismaClient } from "@prisma/client";
import { avaliacaoMensalExtension } from "../../prisma/extensions/avaliacao-mensal-extension";

const basePrisma = new PrismaClient();

const prismaClient = basePrisma.$extends(avaliacaoMensalExtension)

export { prismaClient }