import { Prisma, Permission } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export type PermissionType = {
    name: string;
    description: string
}

class PermissionService {
    async create(data: PermissionType): Promise<Permission> {
        
        const permissionExists = await prismaClient.permission.findFirst({
            where: {
                OR: 
                [
                    { name: data.name },
                    { description: data?.description }
                ]
            }
        })

        if (permissionExists) {
            throw new Error('Já existe um Grupo de Usuário cadastrada com este nome ou descrição')
        }

        const permission = await prismaClient.permission.create({
            data: {
                name: data?.name,
                description: data?.description
            }
        })

        return permission
    }

    async update(id: string, data: PermissionType): Promise<Permission> {
        await prismaClient.permission.update({
            where: {
                id
            },
            data
        })

        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await prismaClient.permission.delete({
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
            ? { 
                AND: {
                    OR: [{name: { mode: Prisma.QueryMode.insensitive, contains: search }}, {description: { mode: Prisma.QueryMode.insensitive, contains: search }}],
                    users_permissions: {
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
        
        const [estados, total] = await prismaClient.$transaction([
            prismaClient.permission.findMany({
                where,
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
            }),
            prismaClient.permission.count({where})
        ])

        return {
            data: estados,
            perPage,
            page,
            skip,
            count: total,
        }
    }

    async deleteAll(permissions: string[]): Promise<any> {
          
        await prismaClient.permission.deleteMany({
            where: {
                id: { in: permissions }
            }
        })
        
    }

    async search(text: any, userId?: string) {
        const permissions = await prismaClient.permission.findMany({
            where: {
                AND: {
                    OR: [{name: { mode: Prisma.QueryMode.insensitive, contains: text }}, {description: { mode: Prisma.QueryMode.insensitive, contains: text }}],
                    users_permissions: {
                        some: {
                            user_id: userId
                        }
                    }
                }
                
            },
            orderBy: {
                name:   'asc'
            },
        })

        return permissions
    }

    async findById(id: string) : Promise<any> {
        const permission = await prismaClient.permission.findUnique({ where: { id } })

        return permission
    }
}

export default new PermissionService