import { Request, Response } from "express";
import roleService from "../services/RoleService";

export class RoleController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const role = await roleService.create(request.body)
            return response.json({
                error: false,
                role,
                message: `Grupo de usuário ${role.name} cadastrado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                role: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const role = await roleService.update(id, request.body)
            return response.json({
                error: false,
                role,
                message: `Grupo de usuário ${role?.name} atualizado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                role: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await roleService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Grupo de usuário deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                role: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await roleService.getAll(request.user?.id, request.query)
            
            return response.json({
                error: false,
                roles: data,
                perPage,
                page,
                skip,
                orderBy,
                order,
                count,
                message: null
            })
        } catch(error) {
            return response.json({
                error: false,
                roles: [],
                message: error.message
            })
        }
    }

    async deleteAll(request: Request, response: Response) {
        const { ids } = request.body
        
        await roleService.deleteAll(ids)

        return response.json({
            ids,
            message: 'Grupos de usuários deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const roles = nome ? await roleService.search(nome, request.user?.id) : await roleService.getAll(request.user?.id, request.query)
        
        return response.json(roles)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const role = await roleService.findById(id)

            return response.json(role)
        } catch(error) {
            return response.json(error.message)
        }
    }
}