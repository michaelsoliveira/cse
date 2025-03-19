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
                pessoa: {
                    pessoaJuridica: {
                        some: {
                            nome_fantasia: data?.nome
                        }
                    }
                }
            }
        })

        if (unidadeExists) {
            throw new Error('Já existe uma unidade escolar cadastrada com este nome ou UF')
        }

        const unidadeEscolar = !data?.hasDiretorData ? await prismaClient.unidadeEscolar.create({
            include: {
                pessoa: true,
                diretor: true
            },
            data: { 
                diretor: {
                    connect: {
                        id: data?.id_diretor
                    }
                },
                pessoa: {
                    create: {
                        tipo: 'J',
                        email: data?.email,
                        pessoaJuridica: {
                            create: {
                                nome_fantasia: data?.nome
                            }
                        },
                        endereco: {
                            create: {
                                cep: data?.endereco?.cep,
                                logradouro: data?.endereco?.logradouro,
                                municipio: data?.endereco?.municipio,
                                numero: data?.endereco?.numero,
                                bairro: data?.endereco.bairro,
                                estado_id: data?.endereco?.estado
                            }
                        }
                    }
                }
            }
        }) : await prismaClient.unidadeEscolar.create({
            include: {
                pessoa: true,
                diretor: true
            },
            data: { 
                diretor: {
                    create: {
                        pessoa: {
                            create: {
                                tipo: 'F',
                                email: data?.diretor?.email,
                                telefone: data?.diretor?.telefone,
                                pessoaFisica: {
                                    create: {
                                        nome: data?.diretor.nome,
                                        rg: data?.diretor.rg,
                                        cpf: data?.diretor.cpf
                                    }
                                }
                            }
                        }
                    }
                },
                pessoa: {
                    create: {
                        tipo: 'J',
                        email: data?.email,
                        telefone: data?.telefone,
                        pessoaJuridica: {
                            create: {
                                nome_fantasia: data?.nome
                            }
                        },
                        endereco: {
                            create: {
                                cep: data?.endereco?.cep,
                                logradouro: data?.endereco?.logradouro,
                                municipio: data?.endereco?.municipio,
                                numero: data?.endereco?.numero,
                                bairro: data?.endereco?.bairro,
                                estado_id: data?.endereco?.estado
                            }
                        }
                    }
                }
            }
        });

        // if (data?.telefones?.lenght > 0) {
        //     await prismaClient.pessoaTelefone.createMany({
        //         data: data?.telefones?.map((tel: any) => {
        //             return {
        //                 ddd: tel.ddd,
        //                 numero: tel.numero,
        //                 pessoa_id: unidadeEscolar.pessoa_id
        //             }
        //         }),
        //     })
        // }

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
        const where = search ? 
            {
                OR: [{pessoa: {
                    pessoaJuridica: {
                        some: {
                            nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: search }
                        }
                    }
                }},
                {pessoa: {
                    pessoaJuridica: {
                        some: {
                            razao_social: { mode: Prisma.QueryMode.insensitive, contains: search }
                        }
                    }
                }}]
            }
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
                    pessoaJuridica: { 
                        some: {
                            nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: text }
                        }
                     }
                }
            },
        })

        return unidades
    }

    async findById(id: string) : Promise<any> {
        const unidade = await prismaClient.unidadeEscolar.findUnique({ where: { id } })

        return unidade
    }
}

export default new UnidadeService