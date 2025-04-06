// import { User } from "../entities/User"
import { Request, Response } from "express";
import parametroService from "../services/ParametroService";

export class ParametroController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const parametro = await parametroService.create(request.body)
            return response.json({
                error: false,
                parametro,
                message: `Parametro ${parametro.nome} cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                especie: null,
                message: error.message
            })
        }
    }
    
     async update(request : Request, response: Response) : Promise<Response> {
        const nome: string = String(request.params.nome)
        
         try {    
            const parametro = await parametroService.update(nome, request.body)
            return response.json({
                error: false,
                parametro,
                message: `Parametro ${parametro.nome} atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                parametro: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const id: string = String(request.params.id)

        try {
            await parametroService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Parametro deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                parametro: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await parametroService.getAll(request.query)
            
            return response.json({
                error: false,
                parametros: data,
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
                parametros: [],
                message: error.message
            })
        }
    }

    async deleteparametros(request: Request, response: Response) {
        const { ids } = request.body
        
        await parametroService.deleteParametros(ids)

        return response.json({
            ids,
            message: 'Parametros deletadas com sucesso',
            error: false
        })   
    }

    async findOne(request: Request, response: Response) {
        const id: string = String(request.params.id)
        try {
            const parametro = await parametroService.findById(id)

            return response.json(parametro)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}