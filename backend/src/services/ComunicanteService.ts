import { Diretor, Prisma, TipoPessoa } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

// export interface DiretorType {
//     pessoa_fisica: {
//         nome: string
//     };
//     id_pessoa: string;
// }

class ComunicanteService {
    async create(data: any): Promise<Diretor> {
        const municipio = data?.endereco?.municipio_id ? { 
            connect: { id: parseInt(data?.endereco?.municipio_id) }
        } : {}

        const estado = data?.endereco?.estado_id ? { 
            connect: { id: parseInt(data?.endereco?.estado_id) }
        } : {}

        const nomeEquals = data?.tipo_pessoa == 'F' ? {
            pessoa: {
                pessoaFisica: {
                    nome: data?.pessoaFisica?.nome
                }
            }
        } : {
            pessoa: {
                pessoaFisica: {
                    nome: data?.pessoaJuridica?.nome_fantasia
                }
            }
        }

        const comunicanteExists = await prismaClient.comunicante.findFirst({
            where: nomeEquals
        })

        if (comunicanteExists) {
            throw new Error('Já existe um comunicante cadastrado com este nome')
        }
        
        const preparedPessoa = data?.tipo_pessoa == 'F' ? {
            pessoaFisica: {
                create: {
                    nome: data?.pessoaFisica?.nome,
                    rg: data?.pessoaFisica?.rg,
                    cpf: data?.pessoaFisica?.cpf,
                    data_nascimento: data?.pessoaFisica?.data_nascimento
                }
            }
        } : {
            pessoaJuridica: {
                create: {
                    nome_fantasia: data?.pessoaJuridica?.nome_fantasia,
                    razao_social: data?.pessoaJuridica?.razao_social,
                    inscricao_estadual: data?.pessoaJuridica?.inscricao_estadual,
                    inscricao_federal: data?.pessoaJuridica?.inscricao_federal,
                    data_constituicao: data?.pessoaJuridica?.data_constituicao
                }
            },
        }
        const enderecoData = data?.hasEnderecoData ? {
            endereco: {
                create: {
                    cep: data?.endereco?.cep,
                    logradouro: data?.endereco?.logradouro,
                    numero: data?.endereco?.numero,
                    bairro: data?.endereco?.bairro,
                    municipio,
                    estado
                }
            }
        } : {}
        const preparedData = {
            pessoa: { 
                create: {
                    telefone: data?.telefone,
                    email: data?.email,
                    tipo: data?.tipo_pessoa == 'F' ? TipoPessoa.F : TipoPessoa.J,
                    ...preparedPessoa
                } 
            },
            ...enderecoData
        }
        
        const comunicante = await prismaClient.comunicante.create({
            include: {
                pessoa: {
                    include: {
                        pessoaFisica: true,
                        pessoaJuridica: true
                    }
                }
            },
            data: preparedData
        })

        return comunicante
    }

    async update(id: string, data: any): Promise<Diretor> {
        const municipio = data?.endereco?.municipio_id ? { 
            connect: { id: parseInt(data?.endereco?.municipio_id) }
        } : {}

        const estado = data?.endereco?.estado_id ? { 
            connect: { id: parseInt(data?.endereco?.estado_id) }
        } : {}

        const preparedPessoa = data?.tipo_pessoa == 'F' ? {
            pessoaFisica: {
                update: {
                    nome: data?.pessoaFisica?.nome,
                    rg: data?.pessoaFisica?.rg,
                    cpf: data?.pessoaFisica?.cpf,
                    data_nascimento: data?.pessoaFisica?.data_nascimento
                },
                where: {
                    pessoa_id: data?.pessoa_id
                }
            }
        } : {
            pessoaJuridica: {
                update: {
                    nome_fantasia: data?.pessoaJuridica?.nome_fantasia,
                    razao_social: data?.pessoaJuridica?.razao_social,
                    inscricao_estadual: data?.pessoaJuridica?.inscricao_estadual,
                    inscricao_federal: data?.pessoaJuridica?.inscricao_federal,
                    data_constituicao: data?.pessoaJuridica?.data_constituicao
                },
                where: {
                    pessoa_id: data?.pessoa_id
                }
            },
        }

        const enderecoData = data?.hasEnderecoData ? {
            endereco: {
                upsert: {
                    where: {
                        id: data?.endereco_id
                    },
                    create: {
                        cep: data?.endereco?.cep,
                        logradouro: data?.endereco?.logradouro,
                        numero: data?.endereco?.numero,
                        bairro: data?.endereco?.bairro,
                        municipio,
                        estado
                    },
                    update: {
                        cep: data?.endereco?.cep,
                        logradouro: data?.endereco?.logradouro,
                        numero: data?.endereco?.numero,
                        bairro: data?.endereco?.bairro,
                        municipio,
                        estado
                    },
                }
            }
        } : {}

        const preparedData = {
            pessoa: { 
                update: {     
                    telefone: data?.telefone,
                    email: data?.email,           
                    tipo: data?.tipo_pessoa == 'F' ? TipoPessoa.F : TipoPessoa.J,
                    ...preparedPessoa
                } 
            },
            ...enderecoData
        }

        const comunicante = await prismaClient.comunicante.update({
            include: {
                pessoa: {
                    include: {
                        pessoaFisica: true,
                        pessoaJuridica: true
                    }
                }
            },
            where: {
                id
            },
            data: preparedData
        })

        return comunicante;
    }

    async delete(id: string): Promise<void> {
        await prismaClient.comunicante.delete({
            where: {
                id
            }
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
        
        const [comunicantes, total] = await prismaClient.$transaction([
            prismaClient.comunicante.findMany({
                select: {
                    pessoa: {
                        select: {
                            id: true,
                            tipo: true,
                            telefone: true,
                            email: true,
                            endereco: {
                                include: {
                                    municipio: {
                                        select: {
                                            id: true,
                                            nome: true
                                        }
                                    }
                                }
                            },
                            pessoaFisica: {
                                select: {                                    
                                    nome: true
                                }
                            },
                            pessoaJuridica: {
                                select: {                                    
                                    nome_fantasia: true
                                }
                            }
                        }
                    }
                },
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: orderByTerm,
            }),
            prismaClient.comunicante.count({where})
        ])

        return {
            data: comunicantes,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteComunicantes(comunicantes: string[]): Promise<any> {
          
        await prismaClient.comunicante.deleteMany({
            where: {
                id: { in: comunicantes}
            }
        })
        
    }

    async findById(id: string) : Promise<any> {
        const comunicante = await prismaClient.comunicante.findUnique({ 
            include: {
                pessoa: {
                    select: {
                        email: true,
                        telefone: true
                    },
                    include: {
                        endereco: true,
                        pessoaFisica: {
                            select: {
                                nome: true
                            }
                        },
                        pessoaJuridica: {
                            select: {
                                nome_fantasia: true
                            }
                        }
                    }
                }
            },
            where: { id } 
        })

        return comunicante
    }
}

export default new ComunicanteService