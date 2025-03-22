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
    ddd: 68
  },
  {
    uf: 'AL',
    nome: 'Alagoas',
    ddd: 82
  },
  {
    uf: 'AM',
    nome: 'Amazonas',
    ddd: 92
  },
  {
    uf: 'AP',
    nome: 'Amapá',
    ddd: 96
  },
  {
    uf: 'BA',
    nome: 'Bahia',
    ddd: 71
  },
  {
    uf: 'CE',
    nome: 'Ceará',
    ddd: 85
  },
  {
    uf: 'DF',
    nome: 'Distrito Federal',
    ddd: 61
  },
  {
    uf: 'ES',
    nome: 'Espírito Santo',
    ddd: 27
  },
  {
    uf: 'GO',
    nome: 'Goiás',
    ddd: 62
  },
  {
    uf: 'MA',
    nome: 'Maranhão',
    ddd: 98
  },
  {
    uf: 'MG',
    nome: 'Minas Gerais',
    ddd: 31
  },
  {
    uf: 'MS',
    nome: 'Mato Grosso do Sul',
    ddd: 67
  },
  {
    uf: 'MT',
    nome: 'Mato Grosso',
    ddd: 65
  },
  {
    uf: 'PA',
    nome: 'Pará',
    ddd: 91
  },
  {
    uf: 'PB',
    nome: 'Paraíba',
    ddd: 83
  },
  {
    uf: 'PE',
    nome: 'Pernambuco',
    ddd: 81
  },
  {
    uf: 'PI',
    nome: 'Piauí',
    ddd: 86
  },
  {
    uf: 'PR',
    nome: 'Paraná',
    ddd: 41
  },
  {
    uf: 'RJ',
    nome: 'Rio de Janeiro',
    ddd: 21
  },
  {
    uf: 'RN',
    nome: 'Rio Grande do Norte',
    ddd: 84
  },
  {
    uf: 'RO',
    nome: 'Rondônia',
    ddd: 69
  },
  {
    uf: 'RR',
    nome: 'Roraima',
    ddd: 95
  },
  {
    uf: 'RS',
    nome: 'Rio Grande do Sul',
    ddd: 51
  },
  {
    uf: 'SC',
    nome: 'Santa Catarina',
    ddd: 47
  },
  {
    uf: 'SE',
    nome: 'Sergipe',
    ddd: 79
  },
  {
    uf: 'SP',
    nome: 'São Paulo',
    ddd: 11
  },
  {
    uf: 'TO',
    nome: 'Tocantins',
    ddd: 63
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