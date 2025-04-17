// atualizar-mes-numero.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mesOrdem: Record<string, number> = {
    'jan': 1,
    'fev': 2,
    'mar': 3,
    'abr': 4,
    'mai': 5,
    'jun': 6,
    'jul': 7,
    'ago': 8,
    'set': 9,
    'out': 10,
    'nov': 11,
    'dez': 12,
  }

async function atualizarMesNumero() {
  const avaliacoes = await prisma.avaliacaoMensal.findMany()

  for (const avaliacao of avaliacoes) {
    const numero = mesOrdem[avaliacao.mes.toLowerCase()] ?? null
    if (numero !== null) {
      await prisma.avaliacaoMensal.update({
        where: { id: avaliacao.id },
        data: { mes_numero: numero }
      })
    }
  }

  console.log('✅ Atualização concluída.')
}

atualizarMesNumero()
  .catch((e) => {
    console.error('Erro na atualização:', e)
  })
  .finally(() => prisma.$disconnect())
