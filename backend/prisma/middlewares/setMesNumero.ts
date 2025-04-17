import { Prisma } from '@prisma/client'

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

export const setMesNumeroMiddleware: Prisma.Middleware = async (params, next) => {
  if (
    params.model === 'AvaliacaoMensal' &&
    (params.action === 'create' || params.action === 'update')
  ) {
    const data = params.args.data

    if (data.mes) {
      const mesLower = data.mes.toLowerCase()
      data.mes_numero = mesOrdem[mesLower] || 0
    }
  }

  return next(params)
}
