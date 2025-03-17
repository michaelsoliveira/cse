import { Request, Response } from "express";
import diretorService from "../services/DiretorService";

export class DiretorController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const diretor = await diretorService.create(request.body)
            return response.json({
                error: false,
                diretor,
                message: `Diretor cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                diretor: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const diretor = await diretorService.update(id, request.body)
            return response.json({
                error: false,
                diretor,
                message: `Diretor atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                diretor: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await diretorService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Unidade deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                diretor: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await diretorService.getAll(request.query)
            
            return response.json({
                error: false,
                diretores: data,
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
                diretores: [],
                message: error.message
            })
        }
    }

    async deleteUnidades(request: Request, response: Response) {
        const { ids } = request.body
        
        await diretorService.deleteDiretores(ids)

        return response.json({
            ids,
            message: 'Diretores deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const diretores = nome ? await diretorService.search(nome) : await diretorService.getAll()

        return response.json(diretores)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const diretor = await diretorService.findById(id)

            return response.json(diretor)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}