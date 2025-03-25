import { Ocorrencia, TipoOcorrencia } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

class OcorrenciaService {
    async create(data: any): Promise<Ocorrencia> {
        const ocorrencia = await prismaClient.ocorrencia.create({
            data: {
                unidade_id: data?.unidade_id,
                classificacao: data?.classificacao,
                data: data?.data ? new Date(data?.data) : undefined,
                hora: data?.hora ? new Date(`1970-01-01T${data?.hora}`) : undefined,
                user_id: data?.user_id,
                // origem_id: data?.origem_id,
                tipo_id: data?.tipo_id,
                descricao: data?.descricao
            }
        })

        return ocorrencia
    }

    async update(id: string, data: any): Promise<Ocorrencia> {

        const ocorrencia = await prismaClient.ocorrencia.update({
            where: {
                id
            },
            data: {
                unidade_id: data?.unidade_id,
                classificacao: data?.classificacao,
                data: data?.data ? new Date(data?.data) : undefined,
                hora: data?.hora ? new Date(`1970-01-01T${data?.hora}`) : undefined,
                origem_id: data?.origem_id,
                tipo_id: data?.tipo_id,
                descricao: data?.descricao
            }
        })

        return ocorrencia
    }

    async delete(id: string): Promise<void> {
        await prismaClient.ocorrencia.delete({
            where: {
                id
            }
        })
    }

    async getAll(query?: any): Promise<any> {
        const { 
            dataInicial,
            dataFinal,
            classificacao,
            unidade_id,
            origem_id,
            user_id,
            tipo_id,
            perPage, 
            page, 
            orderBy, 
            order 
        } = query

        let filters: any = {}

        const skip = (page - 1) * perPage

        const limit = perPage ? parseInt(perPage) : undefined
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : {}
        const orderByTerm = orderByElement?.length > 0 
            ? orderByElement?.reverse().reduce((acc, key) => ({ [key]: acc }), order) 
            : {}

        try {
            // Filtro por intervalo de datas
            if (dataInicial || dataFinal) {
            filters.data = {}
            if (dataInicial) {
                filters.data.gte = new Date(dataInicial as string)
            }
            if (dataFinal) {
                filters.data.lte = new Date(dataFinal as string)
            }
            }

            // Outros filtros opcionais
            if (classificacao) {
            filters.classificacao = classificacao
            }

            if (unidade_id) {
            filters.unidade_id = unidade_id
            }

            if (tipo_id) {
            filters.tipo_id = tipo_id
            }

            if (user_id) {
            filters.user_id = user_id
            }

            if (origem_id) {
                filters.origem_id = origem_id
            }    
            
            const [ocorrencias, total] = await prismaClient.$transaction([
                prismaClient.ocorrencia.findMany({
                    include: {
                        tipo_ocorrencia: true,
                        unidade_escolar: true,
                        user: true,
                        origem: true,
                        anexos: true,
                    },
                    where: filters,
                    take: limit,
                    skip: skip ? skip : 0,
                    orderBy: orderByTerm,
                }),
                prismaClient.ocorrencia.count({where: filters})
            ])

            return {
                data: ocorrencias,
                perPage,
                page,
                skip,
                count: total,
            }
        } catch (error) {
            console.error(error)
        }
    }

    async deleteOcorrencias(ocorrencias: string[]): Promise<any> {
          
        await prismaClient.ocorrencia.deleteMany({
            where: {
                id: { in: ocorrencias}
            }
        })
        
    }

    async getTiposOcorrencia() : Promise<TipoOcorrencia[]>{
        const tipos = await prismaClient.tipoOcorrencia.findMany({
            orderBy: {
                nome: 'asc'
            }
        })

        return tipos
    }

    async findById(id: string) : Promise<any> {
        const ocorrencia = await prismaClient.ocorrencia.findUnique({ 
            include: {
                tipo_ocorrencia: true,
                unidade_escolar: true,
                user: true,
                origem: true,
                anexos: true,
            },
            where: { id } 
        })

        return ocorrencia
    }
}

export default new OcorrenciaService