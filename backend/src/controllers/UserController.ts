// import { User } from "../entities/User"
import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import {
    CreatePermissionService,
    CreateRoleService,
    CreateRolePermissionService,
    CreateUserACLService
} from "../services/UserAclService";
import userService from "../services/UserService";

export interface BaseUser {
    username: string,
    email: string,
    password: string
}

export class UserController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const user = await userService.create(request.body)
            
            return response.json({
                error: false,
                user,
                message: null
            })

        } catch (error: any) {
            return response.json({
                error: true,
                user: null,
                message: error.message
            })
        }
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        const users = nome ? await userService.search(nome) : await userService.getAll()
        return response.json(users)
    }

    async findByEmail(request: Request, response: Response) : Promise<Response> {
        const { email }: any = request.query

        try {
            const user = await userService.findByEmail(email)

            return response.json({
                error: false,
                user,
                message: null
            })
            
        } catch (error: any) {
            return response.json({
                error: true,
                user: null,
                message: error.message
            })
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = request.params?.id

        try {    
            const user = await userService.update(id, request.body)
            
            return response.json({
                error: false,
                user,
                message: 'Usuário atualizado com sucesso!'
            })

        } catch (error: any) {
            return response.json({
                error: true,
                user: null,
                message: error.message
            })
        }
    }

    async updatePassword(request: Request, response: Response): Promise<Response> {
        const id = request?.user?.id

        const { oldPassword, newPassword } = request.body;
        
        try {    
            const user = await userService.updatePassword(id, oldPassword, newPassword)
            
            return response.json({
                error: false,
                user,
                message: 'Senha alterada com sucesso'
            })

        } catch (error: any) {
            return response.json({
                error: true,
                user: null,
                message: error.message
            })
        }
    }

    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await userService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Usuário deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                upa: null,
                message: error.message
            })
        }
    }

    async sendMail(request: Request, response: Response) {
        try {
            const responseEmail = await userService.sendMail(request.body)
            return response.status(200).json({ responseEmail })
        } catch(error) {
            return response.status(400).json({error})
        }

    }

    async createPermission(request: Request, response: Response) {
        const { name, description } = request.body;

        const createPermissionService = new CreatePermissionService();

        const result = await createPermissionService.execute({ name, description });

        if (result instanceof Error) {
            return response.status(400).json(result.message);
        }

        return response.json(result);
    }

    async createRole(request: Request, response: Response) {
        const { name, description } = request.body;

        const createRoleService = new CreateRoleService();

        const result = await createRoleService.execute({ name, description });

        if (result instanceof Error) {
            return response.status(400).json(result.message);
        }

        return response.json(result);
    }

    async createRolePermission(request: Request, response: Response) {
        const { roleId } = request.params;
        const { permissions } = request.body;

        const createRolePermissionService = new CreateRolePermissionService();

        const result = await createRolePermissionService.execute({
            roleId,
            permissions,
        });

        if (result instanceof Error) {
        return response.status(400).json(result.message);
        }

        return response.json(result);
    }

    async createUserACL(request: Request, response: Response) {
        const { permissions, roles } = request.body;
        const { userId } = request.params;

        const createUserACLService = new CreateUserACLService();

        const result = await createUserACLService.execute({
            id:     userId,
            permissions,
            roles,
        });

        if (result instanceof Error) {
        return response.status(400).json(result.message);
        }

        return response.json(result);
    }

    async findProvider(request: Request, response: Response): Promise<any> {
        const { email }: any = request.query
        
        try {
            const user = await userService.findProvider(email)

            return response.json(user)
        } catch (error: any) {
            return response.json(error)
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            let users = await userService.getAll()

            return response.json(users)
        } catch(error: any) {
            return response.json(error.message)
        }
    }

    async findById(request: Request, response: Response) {
        const { userId } = request.query
        
    }

    async findOne(request: Request, response: Response) {
        const { userId, projetoId } = request.params
        try {
            let users = await userService.findOne(userId, projetoId)

            return response.json(users)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}