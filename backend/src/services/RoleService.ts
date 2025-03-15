import { Prisma, Role } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export type RoleType = {
    name: string;
    description: string
}

export type Resource = 'projeto' | 'umf' | 'upa' | 'ut' | 'arvore'

class EstadoService {
    async create(data: RoleType): Promise<any> {
        
        const roleExists = await prismaClient.role.findFirst({
            where: {
                OR: 
                [
                    { name: data.name },
                    { description: data?.description }
                ]
            }
        })

        if (roleExists) {
            throw new Error('Já existe um Grupo de Usuário cadastrada com este nome ou descrição')
        }

        const role = await prismaClient.role.create({
            data: {
                name: data?.name,
                description: data?.description
            }
        })

        return role
    }

    async update(id: string, data: RoleType): Promise<Role> {
        await prismaClient.role.update({
            where: {
                id
            },
            data
        })

        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await prismaClient.role.delete({
            where: {
                id
            }
        })
        .then(response => {
            console.log(response)
        })
    }

    async getAll(userId: string, query?: any): Promise<any> {
        const { perPage, page, search, orderBy, order } = query
        const skip = (page - 1) * perPage
        let orderByTerm = {}
        const where = search
            // ? {OR: [{nome: {contains: search}}, {email: {contains: search}}]}
            ? { 
                AND: {
                    OR: [{ mode: Prisma.QueryMode.insensitive , name: { contains: search } }, { mode: Prisma.QueryMode.insensitive, description: {contains: search}}],
                    users_roles: {
                        some: {
                            user_id: userId
                        }
                    }
                }
            
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
        
        const [data, total] = await prismaClient.$transaction([
            prismaClient.role.findMany({
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.role.count({where})
        ])

        return {
            data,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteAll(roles: string[]): Promise<any> {
          
        await prismaClient.role.deleteMany({
            where: {
                id: { in: roles }
            }
        })
        
    }

    async search(text: any, userId?: string) {
        const roles = await prismaClient.role.findMany({
            where: {
                // AND: {
                    OR: [{name: { mode: Prisma.QueryMode.insensitive, contains: text }}, {description: { mode: Prisma.QueryMode.insensitive, contains: text }}],
                //     users_roles: {
                //         some: {
                //             user_id: userId
                //         }
                //     }
                // }
                
            },
            orderBy: {
                name:   'asc'
            },
        })

        return roles
    }

    async findById(id: string) : Promise<any> {
        const role = await prismaClient.role.findUnique({ where: { id } })

        return role
    }
}

export default new EstadoService