import { Parametro, Prisma } from "@prisma/client"
import { prismaClient } from "../database/prismaClient";

export interface ParametroType {
    nome: string;
    valor: string;
}

class ParametroService {
    async getAll(query?: any): Promise<any> {
        const { perPage, page, search, orderBy, order } = query
        const skip = (page - 1) * perPage
        const where = search
            ?  { nome: { mode: Prisma.QueryMode.insensitive, contains: search} }
            : {};
        
        const orderByElement: Array<string> = orderBy ? orderBy?.split('.') : {}
        const orderByTerm = orderByElement?.length > 0 
            ? orderByElement?.reverse().reduce((acc, key) => ({ [key]: acc }), order) 
            : {}
        
        const [parametros, total] = await prismaClient.$transaction([
            prismaClient.parametro.findMany({
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.parametro.count({where})
        ])

        return {
            data: parametros,
            perPage,
            page,
            skip,
            count: total,
        }
    }
    async create(data: ParametroType): Promise<Parametro> {        
        const parametroExist = await prismaClient.parametro.findFirst({
            where: {
                nome: data.nome
            }
        })

        if (parametroExist) {
            throw new Error('Já existe um Estado cadastrada com este nome ou UF')
        }

        const parametro = await prismaClient.parametro.create({
            data: {
                nome: data.nome,
                valor: data.valor
            }
        })

        return parametro
    }

    async update(nome: string, data: ParametroType): Promise<Parametro> {
        const findParametro = await prismaClient.parametro.findFirst({
            where: {
                nome
            }
        }) as Parametro

        const parametro = await prismaClient.parametro.update({
            where: {
                id: findParametro.id
            },
            data: {
                valor: data.valor
            }
        })

        return parametro
    }

    async delete(id: string): Promise<void> {
        await prismaClient.parametro.delete({
            where: {
                id
            }
        })
        .then(response => {
            console.log(response)
        })
    }

    async deleteParametros(parametros: string[]): Promise<any> {          
        await prismaClient.parametro.deleteMany({
            where: {
                id: { in: parametros}
            }
        })   
    }

    async findById(id: string) : Promise<Parametro | null> {
        const estado = await prismaClient.parametro.findUnique({ where: { id } })

        return estado
    }
}

export default new ParametroService