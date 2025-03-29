import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const roles: Prisma.RoleCreateInput[] = [
  {
    name: 'Admin',
    description: 'Administrador do Sistema'
  },
  {
    name: 'Gerente',
    description: 'Gerente do Sistema'
  },
  {
    name: 'Funcionário',
    description: 'Usuário Padrão'
  }
]

const estados: Prisma.EstadoCreateInput[] = [
  {
    uf: 'AC',
    nome: 'Acre',
    ibge: 12,
    ddd: [68]
  },
  {
    uf: 'AL',
    nome: 'Alagoas',
    ibge: 27,
    ddd: [82]
  },
  {
    uf: 'AM',
    nome: 'Amazonas',
    ibge: 13,
    ddd: [97,92]
  },
  {
    uf: 'AP',
    ibge: 16,
    nome: 'Amapá',
    ddd: [96]
  },
  {
    uf: 'BA',
    nome: 'Bahia',
    ibge: 29,
    ddd: [77,75,73,74,71]
  },
  {
    uf: 'CE',
    nome: 'Ceará',
    ibge: 23,
    ddd: [88,85]
  },
  {
    uf: 'DF',
    nome: 'Distrito Federal',
    ibge: 53,
    ddd: [61]
  },
  {
    uf: 'ES',
    nome: 'Espírito Santo',
    ibge: 32,
    ddd: [28,27]
  },
  {
    uf: 'GO',
    nome: 'Goiás',
    ibge: 52,
    ddd: [62,64,61]
  },
  {
    uf: 'MA',
    nome: 'Maranhão',
    ibge: 21,
    ddd: [99,98]
  },
  {
    uf: 'MG',
    nome: 'Minas Gerais',
    ibge: 31,
    ddd: [34,37,31,33,35,38,32]

  },
  {
    uf: 'MS',
    nome: 'Mato Grosso do Sul',
    ibge: 50,
    ddd: [67]
  },
  {
    uf: 'MT',
    nome: 'Mato Grosso',
    ibge: 51,
    ddd: [65,66]
  },
  {
    uf: 'PA',
    nome: 'Pará',
    ibge: 15,
    ddd: [91,94,93]
  },
  {
    uf: 'PB',
    nome: 'Paraíba',
    ibge: 25,
    ddd: [83]
  },
  {
    uf: 'PE',
    nome: 'Pernambuco',
    ibge: 26,
    ddd: [81,87]
  },
  {
    uf: 'PI',
    nome: 'Piauí',
    ibge: 22,
    ddd: [89,86]
  },
  {
    uf: 'PR',
    nome: 'Paraná',
    ibge: 41,
    ddd: [43,41,42,44,45,46]
  },
  {
    uf: 'RJ',
    nome: 'Rio de Janeiro',
    ibge: 33,
    ddd: [24,22,21]
  },
  {
    uf: 'RN',
    nome: 'Rio Grande do Norte',
    ibge: 24,
    ddd: [84]
  },
  {
    uf: 'RO',
    nome: 'Rondônia',
    ibge: 11,
    ddd: [69]
  },
  {
    uf: 'RR',
    nome: 'Roraima',
    ibge: 14,
    ddd: [95]
  },
  {
    uf: 'RS',
    nome: 'Rio Grande do Sul',
    ibge: 43,
    ddd: [53,54,55,51]
  },
  {
    uf: 'SC',
    nome: 'Santa Catarina',
    ibge: 42,
    ddd: [47,48,49]
  },
  {
    uf: 'SE',
    nome: 'Sergipe',
    ibge: 28,
    ddd: [79]
  },
  {
    uf: 'SP',
    nome: 'São Paulo',
    ibge: 35,
    ddd: [11,12,13,14,15,16,17,18,19]
  },
  {
    uf: 'TO',
    nome: 'Tocantins',
    ibge: 17,
    ddd: [63]
  },
  {
    uf: 'EX',
    nome: 'Exterior',
    ibge: 99,
    ddd: []
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const e of estados) {
    const estado = await prisma.estado.create({
      data: e,
    })
    console.log(`Created estado with id: ${estado.id}`)
  }

  const ufAP = await prisma.estado.findFirst({
    where: {
      uf: {
        equals: 'AP'
      }
    }
  })

  for (const r of roles) {
    const role = await prisma.role.create({
      data: r
    })
    console.log(`Created role with id: ${role.id}`)
  }

  const roleAdmin = await prisma.role.findFirst({
    where: {
      name: {
        equals: 'Admin'
      }
    }
  })

    const user = await prisma.user.create({
      data: {
            username: 'michaelsoliveira',
            email: 'michaelsoliveira@gmail.com',
            password: await bcrypt.hash('secret', 10),
        },
    })

    const tiposOcorrencia: Prisma.TipoOcorrenciaCreateInput[] = [
      { nome: "Roubo" },
      { nome: "Furto" },
      { nome: "Vulnerabilidade" },
      { nome: "Intrusão" },
      { nome: "Ameaça" },
      { nome: "Uso de Arma de Fogo" },
      { nome: "Porte de Arma" },
      { nome: "Danos ao Patrimônio" },
      { nome: "Ameaça a Escola" }
    ];

    for (const t of tiposOcorrencia) {
      const tipo = await prisma.tipoOcorrencia.create({
        data: t
      })
      console.log(`Created role with id: ${tipo.id}`)
    }
    
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })