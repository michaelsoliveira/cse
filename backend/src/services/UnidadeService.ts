import { Prisma, UnidadeEscolar } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export interface UnidadeType {
    pessoa_juridica: {
        nome_fantasia: string
    };
    id_diretor: string;
}

class UnidadeService {
    async create(data: any): Promise<UnidadeEscolar> {
        
        const unidadeExists = await prismaClient.unidadeEscolar.findFirst({
            where: {
                nome: data?.nome
            }
        })

        if (unidadeExists) {
            throw new Error('Já existe uma unidade escolar cadastrada com este nome ou UF')
        }

        const unidadeEscolar = await prismaClient.unidadeEscolar.create({
            include: {
                pessoa: true,
                diretor: true,
            },
            data: {
                nome: data.nome,
                unidade_telefone: {
                    create: {
                        telefone: {
                            create: {
                                ddd: data?.ddd,
                                numero: data?.telefone
                            }
                        }
                    }
                },
                pessoa: {
                    create: {
                        nome_fantasia: data.nome,
                        pessoa: {
                            create: {
                                tipo: 'J',
                                endereco: {
                                    create: {
                                        logradouro: data?.logradouro,
                                        municipio: data?.municipio,
                                        bairro: data?.bairro,
                                        id_estado: data?.estado
                                    }
                                }
                            }
                        }
                    }
                },
                diretor: {
                    connect: data?.id_diretor
                }

            }
        })

        return unidadeEscolar
    }

    async update(id: string, data: any): Promise<UnidadeEscolar> {
        await prismaClient.unidadeEscolar.update({
            where: {
                id
            },
            data
        })

        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await prismaClient.unidadeEscolar.delete({
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
                nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: search }
            }}, {pessoa: {
                razao_social: { mode: Prisma.QueryMode.insensitive, contains: search }
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
        
        const [unidades, total] = await prismaClient.$transaction([
            prismaClient.unidadeEscolar.findMany({
                include: {
                    pessoa: true,
                    diretor: {
                        include: {
                            pessoa: true
                        }
                    }
                },
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.unidadeEscolar.count({where})
        ])

        return {
            data: unidades,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteUnidades(unidades: string[]): Promise<any> {
          
        await prismaClient.unidadeEscolar.deleteMany({
            where: {
                id: { in: unidades}
            }
        })
        
    }

    async search(text: any) {
        const unidades = await prismaClient.unidadeEscolar.findMany({
            where: {
                pessoa: {
                    nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: text }
                }
                // OR: [{id: {mode: 'insensitive', contains: text}}, {uf: {mode: 'insensitive', contains: text}}]
            },
            // orderBy: {
            //     nome:   'asc'
            // },
        })

        return unidades
    }

    async findById(id: string) : Promise<any> {
        const unidade = await prismaClient.unidadeEscolar.findUnique({ where: { id } })

        return unidade
    }
}

export default new UnidadeService