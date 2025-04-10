import { Request, Response } from "express";
import avaliacaoUnidadeService from "../services/AvaliacaoUnidadeService";

export class AvaliacaoUnidadeController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const avaliacao = await avaliacaoUnidadeService.create(request.body)
            return response.json({
                error: false,
                avaliacao,
                message: `Avaliação de unidade cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                avaliacao: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const avaliacao = await avaliacaoUnidadeService.update(id, request.body)
            return response.json({
                error: false,
                avaliacao,
                message: `Avaliacao de unidade atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                avaliacao: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await avaliacaoUnidadeService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Avaliação de unidade deletada com Sucesso!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                avaliacao: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await avaliacaoUnidadeService.getAll(request.query)
            
            return response.json({
                error: false,
                avaliacaoes: data,
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
                avaliacaoes: [],
                message: error.message
            })
        }
    }

    async deleteAvaliacoes(request: Request, response: Response) {
        const { ids } = request.body
        
        await avaliacaoUnidadeService.deleteAvaliacoes(ids)

        return response.json({
            ids,
            message: 'Avaliacaoes de unidades deletadas com sucesso',
            error: false
        })   
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const avaliacao = await avaliacaoUnidadeService.findById(id)

            return response.json(avaliacao)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}