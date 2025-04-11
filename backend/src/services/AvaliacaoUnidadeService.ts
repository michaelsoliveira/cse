import { AvaliacaoMensal, Estado, Mes, Municipio, Prisma, StatusAvaliacao } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export interface AvaliacaoUnidadeType {
    unidade_id: string;
    ano: number;
    mes: Mes;
    status: StatusAvaliacao;
    obs?: string
}

class AvaliacaoUnidadeService {

    async delete(id: string) {
        await prismaClient.avaliacaoMensal.delete({ where: { id } })
    }
    async create(data: AvaliacaoUnidadeType): Promise<AvaliacaoMensal> {
        
        const avaliacaoUnidade = await prismaClient.avaliacaoMensal.findFirst({
            where: {
                AND: 
                [
                    { unidade_id: data.unidade_id },
                    { ano: Number(data.ano) },
                    { mes: data?.mes },
                ]
            }
        })

        if (avaliacaoUnidade) {
            throw new Error('Já existe uma avaliação cadastrada para esta mesma [Unidade, Ano e Mês]')
        }

        const avaliacao = await prismaClient.avaliacaoMensal.create({
            data: {
                unidade_id: data?.unidade_id,
                ano: Number(data?.ano),
                mes: data?.mes,
                status: data?.status,
                obs: data?.obs
            }
        })

        return avaliacao
    }

    async update(id: string, data: AvaliacaoUnidadeType): Promise<AvaliacaoMensal> {
        const avaliacaoUnidade = await prismaClient.avaliacaoMensal.update({
            where: {
                id
            },
            data: {
                unidade_id: data?.unidade_id,
                ano: Number(data.ano),
                mes: data?.mes,
                status: data?.status,
                obs: data?.obs
            }
        })

        return avaliacaoUnidade
    }

    async getAll(query?: any): Promise<any> {
        const { perPage, page, unidade_id, ano, mes, status, orderBy, order } = query
        const skip = (page - 1) * perPage
        let where: any = {}
        
        if (unidade_id) {
            where.unidade_id = unidade_id
        }

        if (ano) {
            where.ano = parseInt(ano)
        }

        if (mes) {
            where.mes = mes
        }

        if (status) {
            where.status = status
        }
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : {}
        const orderByTerm = orderByElement?.length > 0 
            ? orderByElement?.reverse().reduce((acc, key) => ({ [key]: acc }), order) 
            : {}
        
        const [avaliacoes, total] = await prismaClient.$transaction([
            prismaClient.avaliacaoMensal.findMany({
                select: {
                    id: true,
                    ano: true,
                    mes: true,
                    status: true,
                    obs: true,
                    unidade_id: true,
                    unidade: {
                        select: {
                            pessoa: {
                                select: {
                                    pessoaJuridica: {
                                        select: {
                                            nome_fantasia: true
                                        }
                                    }
                                }
                            }
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
            prismaClient.avaliacaoMensal.count({where})
        ])

        return {
            data: avaliacoes,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteAvaliacoes(avaliacoes: string[]): Promise<any> {
          
        await prismaClient.avaliacaoMensal.deleteMany({
            where: {
                id: { in: avaliacoes}
            }
        })   
    }

    async findById(id: string) : Promise<any> {
        const avaliacaoUnidade = await prismaClient.avaliacaoMensal.findUnique({ where: { id } })

        return avaliacaoUnidade
    }
}

export default new AvaliacaoUnidadeService