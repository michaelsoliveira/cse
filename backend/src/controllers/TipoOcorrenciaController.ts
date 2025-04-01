import { Request, Response } from "express";
import tipoOcorrenciaService from "../services/TipoOcorrencia";

export class TipoOcorrenciaController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const tipoOcorrencia = await tipoOcorrenciaService.create(request.body)
            return response.json({
                error: false,
                tipoOcorrencia,
                message: `Tipo da ocorrência ${tipoOcorrencia.nome} cadastrado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                tipoOcorrencia: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const tipoOcorrencia = await tipoOcorrenciaService.update(id, request.body)
            return response.json({
                error: false,
                tipoOcorrencia,
                message: `Tipo da ocorrência ${tipoOcorrencia?.nome} atualizado com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                tipoOcorrencia: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await tipoOcorrenciaService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Tipo da ocorrência deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                tipoOcorrencia: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await tipoOcorrenciaService.getAll(request.query)
            
            return response.json({
                error: false,
                tipoOcorrencias: data,
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
                tipoOcorrencias: [],
                message: error.message
            })
        }
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const tipoOcorrencia = await tipoOcorrenciaService.findById(id)

            return response.json(tipoOcorrencia)
        } catch(error) {
            return response.json(error.message)
        }
    }
}