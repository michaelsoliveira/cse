import { Request, Response } from "express";
import comunicanteService from "../services/ComunicanteService";

export class ComunicanteController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const comunicante = await comunicanteService.create(request.body)
            return response.json({
                error: false,
                comunicante,
                message: `Comunicante cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                comunicante: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const comunicante = await comunicanteService.update(id, request.body)
            return response.json({
                error: false,
                comunicante,
                message: `Comunicante atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                comunicante: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await comunicanteService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Comunicante deletado com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                comunicante: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await comunicanteService.getAll(request.query)
            
            return response.json({
                error: false,
                comunicantes: data,
                perPage,
                page,
                skip,
                orderBy,
                order,
                count,
                message: null
            })
        } catch(error: any) {
            return response.json({
                error: false,
                comunicantes: [],
                message: error.message
            })
        }
    }

    async deleteComunicantees(request: Request, response: Response) {
        const { ids } = request.body
        
        await comunicanteService.deleteComunicantes(ids)

        return response.json({
            ids,
            message: 'Diretores deletadas com sucesso',
            error: false
        })   
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const comunicante = await comunicanteService.findById(id)

            return response.json(comunicante)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}