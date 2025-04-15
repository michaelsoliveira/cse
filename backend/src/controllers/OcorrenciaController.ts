import { Request, Response } from "express";
import ocorrenciaService from "../services/OcorrenciaService";

export class OcorrenciaController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const { id: user_id } = request.user
            const ocorrencia = await ocorrenciaService.create({ ...request.body, user_id })
            return response.json({
                error: false,
                ocorrencia,
                message: 'Ocorrência cadastrada com SUCESSO!!!'
            })

        } catch (error: any) {
            return response.json({
                error: true,
                ocorrencia: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
        const { id: user_id } = request.user
         try {    
            const ocorrencia = await ocorrenciaService.update(id, { ...request.body, user_id })
            return response.json({
                error: false,
                ocorrencia,
                message: `Ocorrência atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                ocorrencia: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await ocorrenciaService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Ocorrência deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                message: error.message
            })
        }
    }

    async getUploadUrl(request: Request, response: Response) {
        const { filename, type } = request.body;
    
        if (!filename || !type) {
          return response.status(400).json({ error: "Parâmetros inválidos" });
        }
    
        const uploadData = await ocorrenciaService.uploadS3({ filename, contentType: type });
        return response.json(uploadData);
      }

    async getLastOcorrencias(request: Request, response: Response) {
        const { limit } = request.query as any
        
        try {
            const ocorrencias = await ocorrenciaService.getLastOcorrencias(parseInt(limit))
            return response.json({
                error: false,
                ocorrencias
            })
        } catch (e) {
            return response.json({
                error: true,
                message: e.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { 
                data, 
                limit, 
                page, 
                orderBy, 
                order, 
                skip, 
                count 
            } = await ocorrenciaService.getAll(request.query)
            
            return response.json({
                error: false,
                ocorrencias: data,
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
                ocorrencias: [],
                message: error.message
            })
        }
    }

    async deleteOcorrencias(request: Request, response: Response) {
        const { ids } = request.body
        
        await ocorrenciaService.deleteOcorrencias(ids)

        return response.json({
            ids,
            message: 'Ocorrências deletadas com sucesso',
            error: false
        })   
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const ocorrencia = await ocorrenciaService.findById(id)

            return response.json(ocorrencia)
        } catch(error: any) {
            return response.json(error.message)
        }
    }

    async getTiposOcorrencia(request: Request, response: Response) {
        try {
            const tipos = await ocorrenciaService.getTiposOcorrencia()

            return response.json(tipos)
        } catch (error: any) {
            return response.json(error.message)
        }
    }
}