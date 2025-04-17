import { Prisma, PrismaClient } from '@prisma/client'

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

export const avaliacaoMensalExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      avaliacaoMensal: {
        async createWithMesAuto(args: Prisma.AvaliacaoMensalCreateArgs) {
          const mes = args.data.mes?.toUpperCase()
          const mes_numero = mesOrdem[mes || ''] || 0

          return client.avaliacaoMensal.create({
            ...args,
            data: {
              ...args.data,
              mes_numero,
            },
          })
        },

        async updateWithMesAuto(args: Prisma.AvaliacaoMensalUpdateArgs) {
          const mes = String(args.data.mes)
          const mes_numero = mesOrdem[mes || ''] || 0

          return client.avaliacaoMensal.update({
            ...args,
            data: {
              ...args.data,
              mes_numero,
            },
          })
        },
      },
    },
  })
})
