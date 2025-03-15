import { Estado, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export interface EstadoType {
    nome: string;
    uf: string;
    ddd?: number;
}

class EstadoService {
    async create(data: EstadoType): Promise<Estado> {
        
        const estadoExists = await prismaClient.estado.findFirst({
            where: {
                OR: 
                [
                    { nome: data.nome },
                    { uf: data.nome }
                ]
            }
        })

        if (estadoExists) {
            throw new Error('Já existe um Estado cadastrada com este nome ou UF')
        }

        const estado = await prismaClient.estado.create({
            data: {
                nome: data.nome,
                uf: data.uf,
                ddd: data.ddd,
                    
            }
        })

        return estado
    }

    async update(id: string, data: EstadoType): Promise<Estado> {
        await prismaClient.estado.update({
            where: {
                id
            },
            data
        })

        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await prismaClient.estado.delete({
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
            ? {OR: [{mode: Prisma.QueryMode.insensitive, nome: {contains: search}}, {mode: Prisma.QueryMode.insensitive, uf: {contains: search}}]}
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
        
        const [estados, total] = await prismaClient.$transaction([
            prismaClient.estado.findMany({
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.estado.count({where})
        ])

        return {
            data: estados,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteEstados(estados: string[]): Promise<any> {
          
        await prismaClient.estado.deleteMany({
            where: {
                id: { in: estados}
            }
        })
        
    }

    async search(text: any) {
        const estados = await prismaClient.estado.findMany({
            where: {
                OR: [{nome: {mode: 'insensitive', contains: text}}, {uf: {mode: 'insensitive', contains: text}}]
            },
            orderBy: {
                nome:   'asc'
            },
        })

        return estados
    }

    async findById(id: string) : Promise<any> {
        const estado = await prismaClient.estado.findUnique({ where: { id } })

        return estado
    }
}

export default new EstadoService