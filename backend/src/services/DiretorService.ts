import { Diretor, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

// export interface DiretorType {
//     pessoa_fisica: {
//         nome: string
//     };
//     id_pessoa: string;
// }

class DiretorService {
    async create(data: any): Promise<Diretor> {
        
        const diretorExists = await prismaClient.diretor.findFirst({
            where: {
                pessoa: {
                    nome: data.pessoa_fisica.nome
                } 
            }
        })

        if (diretorExists) {
            throw new Error('Já existe uma diretor cadastrada com este nome ou UF')
        }

        const diretor = await prismaClient.diretor.create({
            include: {
                pessoa: true
            },
            data: {
                pessoa: {
                    create: {
                        pessoa: {
                            create: {
                                tipo: 'F',
                                email: data?.email
                            }
                        },
                        nome: data?.nome,
                        rg: data?.rg,
                        cpf: data?.cpf
                    }
                },
            }
        })

        return diretor
    }

    async update(id: string, data: any): Promise<Diretor> {
        await prismaClient.diretor.update({
            where: {
                id
            },
            data: {
                pessoa: {
                    update: {
                        pessoa: {
                            update: {
                                email: data?.email,
                            }
                        },
                        nome: data?.nome,
                        rg: data?.rg,
                        cpf: data?.cpf
                    }
                },
            }
        })

        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await prismaClient.diretor.delete({
            where: {
                id
            }
        })
        .then(response => {
            console.log(response)
        })
    }

    async getAll(query?: any): Promise<any> {
        const { perPage, page, search, orderBy, order } = query
        const skip = (page - 1) * perPage
        let orderByTerm = {}
        const where = search
            // ? {OR: [{nome: {contains: search}}, {email: {contains: search}}]}
            ? {OR: [{pessoa: {
                npme: { mode: Prisma.QueryMode.insensitive, contains: search }
            }}, {pessoa: {
                cpf: search
            }}]}
            : {};
        
        const orderByElement = orderBy ? orderBy.split('.') : {}
        
        if (orderByElement.length == 2) {
            orderByTerm = {
                [orderByElement[1]]: order
            }
        } else {
            orderByTerm = {
                [orderByElement]: order
            }
        }
        
        const [diretores, total] = await prismaClient.$transaction([
            prismaClient.diretor.findMany({
                include: {
                    pessoa: true
                },
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.diretor.count({where})
        ])

        return {
            data: diretores,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteDiretores(diretores: string[]): Promise<any> {
          
        await prismaClient.diretor.deleteMany({
            where: {
                id: { in: diretores}
            }
        })
        
    }

    async search(text: any) {
        const diretores = await prismaClient.diretor.findMany({
            where: {
                pessoa: {
                    nome: { mode: Prisma.QueryMode.insensitive, contains: text }
                }
                // OR: [{id: {mode: 'insensitive', contains: text}}, {uf: {mode: 'insensitive', contains: text}}]
            },
            // orderBy: {
            //     nome:   'asc'
            // },
        })

        return diretores
    }

    async findById(id: string) : Promise<any> {
        const diretor = await prismaClient.diretor.findUnique({ where: { id } })

        return diretor
    }
}

export default new DiretorService