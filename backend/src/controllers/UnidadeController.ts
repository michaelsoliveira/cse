import { Request, Response } from "express";
import unidadeService from "../services/UnidadeService";

export class UnidadeController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const unidade = await unidadeService.create(request.body)
            return response.json({
                error: false,
                unidade,
                message: `Unidade cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                unidade: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const unidade = await unidadeService.update(id, request.body)
            return response.json({
                error: false,
                unidade,
                message: `Unidade atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                unidade: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await unidadeService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Unidade deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                unidade: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, limit, page, orderBy, order, skip, count } = await unidadeService.getAll(request.query)
            
            return response.json({
                error: false,
                unidades: data,
                limit,
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
                unidades: [],
                message: error.message
            })
        }
    }

    async deleteUnidades(request: Request, response: Response) {
        const { ids } = request.body
        
        await unidadeService.deleteUnidades(ids)

        return response.json({
            ids,
            message: 'Unidades deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const unidades = nome ? await unidadeService.search(nome) : await unidadeService.getAll()

        return response.json(unidades)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const unidade = await unidadeService.findById(id)

            return response.json(unidade)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}