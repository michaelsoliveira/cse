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
                    pessoaFisica: {
                        nome: data?.nome
                    }
                } 
            }
        })

        if (diretorExists) {
            throw new Error('Já existe uma diretor cadastrada com este nome ou UF')
        }

        const diretor = await prismaClient.diretor.create({
            include: {
                pessoa: {
                    include: {
                        pessoaFisica: true
                    }
                }
            },
            data: {
                unidade: {
                    connect: { id: data?.unidade_id }
                },
                pessoa: {
                    create: {
                        tipo: 'F',
                        telefone: data?.telefone,
                        email: data?.email,
                        pessoaFisica: {
                            create: {
                                nome: data?.nome,
                                rg: data?.rg,
                                cpf: data?.cpf,
                                data_nascimento: data?.data_nascimento
                            }
                        }
                    }
                }
            }
        })

        return diretor
    }

    async update(id: string, data: any): Promise<Diretor> {
        const diretor = await prismaClient.diretor.update({
            include: {
                pessoa: {
                    include: {
                        pessoaFisica: true
                    }
                }
            },
            where: {
                id
            },
            data: {
                unidade: {
                    connect: { id: data?.unidade_id }
                },
                pessoa: {
                    update: {
                        tipo: 'F',
                        email: data?.email,
                        telefone: data?.telefone,
                        pessoaFisica: {
                            update: {
                                data: {
                                    nome: data?.nome,
                                    rg: data?.rg,
                                    cpf: data?.cpf,
                                    data_nascimento: data?.data_nascimento
                                },
                                where: {
                                    pessoa_id: data?.pessoa_id
                                }
                            }
                        }
                    },
                }
            }
        })

        return diretor
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
        
        const where = search
            // ? {OR: [{nome: {contains: search}}, {email: {contains: search}}]}
            ? {OR: [
                {
                    pessoa: {
                        pessoaFisica: {
                                nome: { mode: Prisma.QueryMode.insensitive, contains: search }
                        }
                    }}, {
                        pessoa: {
                            pessoaFisica: {
                                cpf: search
                            }
                        }
                    }
                ]}
            : {};
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : {}
        const orderByTerm = orderByElement?.length > 0 
            ? orderByElement?.reverse().reduce((acc, key) => ({ [key]: acc }), order) 
            : {}
        
        const [diretores, total] = await prismaClient.$transaction([
            prismaClient.diretor.findMany({
                include: {
                    pessoa: {
                        include: {
                            pessoaFisica: true
                        }
                    }
                },
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: orderByTerm,
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
                    pessoaFisica: {
                        nome: { mode: Prisma.QueryMode.insensitive, contains: text }
                    }
                }
            },
        })

        return diretores
    }

    async findById(id: string) : Promise<any> {
        const diretor = await prismaClient.diretor.findUnique({ where: { id } })

        return diretor
    }
}

export default new DiretorService