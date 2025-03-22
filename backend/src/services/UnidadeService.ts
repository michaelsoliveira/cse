import { Prisma, TipoPessoa, UnidadeEscolar } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { OrderByTerm } from "../utils";

export interface UnidadeType {
    pessoa_juridica: {
        nome_fantasia: string
    };
    diretor_id: string;
}

class UnidadeService {
    async create(dataRequest: any): Promise<UnidadeEscolar> {
        
        const unidadeExists = await prismaClient.unidadeEscolar.findFirst({
            where: {
                pessoa: {
                    pessoaJuridica: {
                        nome_fantasia: dataRequest?.nome
                    }
                }
            }
        })

        if (unidadeExists) {
            throw new Error('Já existe uma unidade escolar cadastrada com este nome')
        }
        
        const municipio = dataRequest?.endereco?.municipio_id ? { 
                connect: { id: parseInt(dataRequest?.endereco?.municipio_id) }
            } : {}

        const estado = dataRequest?.endereco?.estado_id ? { 
            connect: { id: parseInt(dataRequest?.endereco?.estado_id) }
        } : {}
        
        const diretor = dataRequest?.hasDiretorData ? {
            create: {
                pessoa: {
                    create: {
                        tipo: TipoPessoa.F,
                        email: dataRequest?.diretor?.email,
                        telefone: dataRequest?.diretor?.telefone,
                        pessoaFisica: {
                            create: {
                                nome: dataRequest?.diretor?.nome,
                                rg: dataRequest?.diretor?.rg,
                                cpf: dataRequest?.diretor?.cpf
                            }
                        }
                    }
                }
            }
        } : dataRequest?.diretor_id ? {
            connect: {
                id: dataRequest?.diretor_id
            }
        } : {}
        
        const data = { 
            inep: dataRequest?.inep,
            zona: dataRequest?.zona,
            diretor,
            pessoa: {
                create: {
                    tipo: TipoPessoa.J,
                    email: dataRequest?.email,
                    telefone: dataRequest?.telefone,
                    pessoaJuridica: {
                        create: {
                            nome_fantasia: dataRequest?.nome
                        }
                    },
                    endereco: {
                        create: {
                            cep: dataRequest?.endereco?.cep,
                            logradouro: dataRequest?.endereco?.logradouro,
                            numero: dataRequest?.endereco?.numero,
                            bairro: dataRequest?.endereco?.bairro,
                            municipio,
                            estado
                        }
                    }
                }
            }
        }
        
        const unidadeEscolar = await prismaClient.unidadeEscolar.create({
            include: {
                pessoa: {
                    include: {
                        pessoaJuridica: true,
                        endereco: true
                    }
                },
                diretor: true
            },
            data
        })

        return unidadeEscolar
    }

    async update(id: string, dataRequest: any): Promise<UnidadeEscolar> {
        const municipio = dataRequest?.endereco?.municipio_id ? { 
            connect: { id: parseInt(dataRequest?.endereco?.municipio_id) }
        } : {}

        const estado = dataRequest?.endereco?.estado_id ? { 
            connect: { id: parseInt(dataRequest?.endereco?.estado_id) }
        } : {}
        
        const diretor = dataRequest?.hasDiretorData ? {
            upsert: {
                where: {
                    id: dataRequest?.diretor_id
                },
                create: {
                    pessoa: {
                        create: {
                            tipo: TipoPessoa.F,
                            email: dataRequest?.diretor?.email,
                            telefone: dataRequest?.diretor?.telefone,
                            pessoaFisica: {
                                create: {
                                    nome: dataRequest?.diretor?.nome,
                                    rg: dataRequest?.diretor?.rg,
                                    cpf: dataRequest?.diretor?.cpf
                                }
                            }
                        }
                    }
                },
                update: {
                    pessoa: {
                        update: {
                            tipo: TipoPessoa.F,
                            email: dataRequest?.diretor?.email,
                            telefone: dataRequest?.diretor?.telefone,
                            pessoaFisica: {
                                update: {
                                    nome: dataRequest?.diretor?.nome,
                                    rg: dataRequest?.diretor?.rg,
                                    cpf: dataRequest?.diretor?.cpf
                                }
                            }
                        }
                    }
                }
            }
        } : dataRequest?.diretor_id ? {
            connect: {
                id: dataRequest?.diretor_id
            }
        } : {}
        
        const data = { 
            inep: dataRequest?.inep,
            zona: dataRequest?.zona,
            diretor,
            pessoa: {
                update: {
                    tipo: TipoPessoa.J,
                    email: dataRequest?.email,
                    telefone: dataRequest?.telefone,
                    pessoaJuridica: {
                        update: {
                            nome_fantasia: dataRequest?.nome
                        }
                    },
                    endereco: {
                        upsert: {
                            where: {
                                id: dataRequest?.pessoa?.endereco_id
                            },
                            update: {
                                cep: dataRequest?.endereco?.cep,
                                logradouro: dataRequest?.endereco?.logradouro,
                                numero: dataRequest?.endereco?.numero,
                                bairro: dataRequest?.endereco?.bairro,
                                municipio,
                                estado
                            },
                            create: {
                                cep: dataRequest?.endereco?.cep,
                                logradouro: dataRequest?.endereco?.logradouro,
                                numero: dataRequest?.endereco?.numero,
                                bairro: dataRequest?.endereco?.bairro,
                                municipio,
                                estado
                            }
                        }
                    }
                    }
            }
        }
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
    }

    async getAll(query?: any): Promise<any> {
        const { limit, page, search, orderBy, order, zonas: zonasQuery, municipio } = query
        const zonas = zonasQuery?.split('.')
        const skip = (page - 1) * limit
        
        const wherePrepared = search ? 
            {
                OR: [{pessoa: {
                    pessoaJuridica: {
                        nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: search }
                    }
                }},
                {pessoa: {
                    pessoaJuridica: {
                        razao_social: { mode: Prisma.QueryMode.insensitive, contains: search }
                    }
                }}]
            }
            : {};
        
        const where 
        = zonas ? {
            AND: [
                {...wherePrepared},
                {
                    zona: {
                        in: zonas
                    }
                }
            ]
        } : {
            ...wherePrepared
        }
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : []
    const orderByTerm = orderByElement?.length > 0 
        ? orderByElement?.reverse().reduce((acc: any, key) => ({ [key]: acc }), order) 
        : {}
        
        const [unidades, total] = await prismaClient.$transaction([
            prismaClient.unidadeEscolar.findMany({
                include: {
                    pessoa: {
                        include: {
                            endereco: {
                                include: {
                                    municipio: true
                                }
                            },
                            pessoaJuridica: true
                        }
                    },
                    diretor: {
                        include: {
                            pessoa: {
                                include: {
                                    pessoaFisica: true
                                }
                            }
                        }
                    }
                },
                where,
                take: limit ? parseInt(limit) : 50,
                skip: skip ? skip : 0,
                orderBy: orderByTerm,
            }),
            prismaClient.unidadeEscolar.count({where})
        ])

        return {
            data: unidades,
            limit,
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
                        nome_fantasia: { mode: Prisma.QueryMode.insensitive, contains: text }
                     }
                }
            },
        })

        return unidades
    }

    async findById(id: string) : Promise<any> {
        const unidade = await prismaClient.unidadeEscolar.findUnique({ 
            include: {
                pessoa: {
                    include: {
                        endereco: true,
                        pessoaJuridica: true
                    }
                },
                diretor: {
                    include: {
                        pessoa: {
                            include: {
                                pessoaFisica: true
                            }
                        }
                    }
                }
            },
            where: { id } 
        })

        return unidade
    }
}

export default new UnidadeService