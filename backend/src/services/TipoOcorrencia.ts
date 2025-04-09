import { Prisma, TipoOcorrencia } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

class TipoOcorrenciaService {
    async create(data: any): Promise<TipoOcorrencia> {
        const tipoOcorrenciaExists = await prismaClient.tipoOcorrencia.findFirst({
            where: {
                nome: data?.nome
            }
        })

        if (tipoOcorrenciaExists) {
            throw new Error('Já existe um tipo de ocorrência cadastrada com este nome')
        }
        
        const tipoOcorrencia = await prismaClient.tipoOcorrencia.create({
            data: {
                nome: data?.nome
            }
        })

        return tipoOcorrencia
    }

    async update(id: string, data: any): Promise<TipoOcorrencia> {
        const tipoOcorrencia = await prismaClient.tipoOcorrencia.update({
            where: {
                id
            },
            data: {
                nome: data?.nome
            }
        })

        return tipoOcorrencia
    }

    async delete(id: string): Promise<void> {
        await prismaClient.tipoOcorrencia.delete({
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
            ? {
                nome: {contains: search}
            }
            : {};
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : {}
        const orderByTerm = orderByElement?.length > 0 
            ? orderByElement?.reverse().reduce((acc, key) => ({ [key]: acc }), order) 
            : {}
        
        const [tiposOcorrencia, total] = await prismaClient.$transaction([
            prismaClient.tipoOcorrencia.findMany({
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: orderByTerm,
            }),
            prismaClient.tipoOcorrencia.count({where})
        ])

        return {
            data: tiposOcorrencia,
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

    async findById(id: string) : Promise<TipoOcorrencia | null> {
        const tipoOcorrencia = await prismaClient.tipoOcorrencia.findUnique({ 
            where: { id } 
        })

        return tipoOcorrencia
    }
}

export default new TipoOcorrenciaService