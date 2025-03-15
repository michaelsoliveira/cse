import { Request, Response } from "express";
import permissionService from "../services/PermissionService";

export class PermissionController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const permission = await permissionService.create(request.body)
            return response.json({
                error: false,
                permission,
                message: `Permissão ${permission.name} cadastrado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                permission: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const permission = await permissionService.update(id, request.body)
            return response.json({
                error: false,
                permission,
                message: `Permissão ${permission?.name} atualizado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                permission: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await permissionService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Permissão deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                permission: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await permissionService.getAll(request.user?.id, request.query)
            
            return response.json({
                error: false,
                permissions: data,
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
                permissions: [],
                message: error.message
            })
        }
    }

    async deleteAll(request: Request, response: Response) {
        const { ids } = request.body
        
        await permissionService.deleteAll(ids)

        return response.json({
            ids,
            message: 'Permissões deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const permissions = nome ? await permissionService.search(nome, request.user?.id) : await permissionService.getAll(request.user?.id)

        return response.json(permissions)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const permission = await permissionService.findById(id)

            return response.json(permission)
        } catch(error) {
            return response.json(error.message)
        }
    }
}