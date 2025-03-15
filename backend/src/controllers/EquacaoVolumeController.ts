// import { User } from "../entities/User"
import { Request, Response } from "express";
import eqVolumeService from "../services/EquacaoVolumeService";

export class EquacaoVolumeController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const eqVolume = await eqVolumeService.create(request.body, request.user?.id)
            return response.json({
                error: false,
                equacaoVolume: eqVolume,
                message: `Equação ${eqVolume.nome} cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                equacaoVolume: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { id } = request.params
         try {    
            const eqVolume = await eqVolumeService.update(id, request.body)
            return response.json({
                error: false,
                equacaoVolume: eqVolume,
                message: `Equação ${eqVolume.nome} atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                equacaoVolume: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await eqVolumeService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Equacação Volume deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                equacaoVolume: null,
                message: error.message
            })
        }
    }

    async getEqModelos(request: Request, response: Response) {

        const data = await eqVolumeService.getEqModelos()

        return response.json({
            error: false,
            data,
            message: null
        })
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await eqVolumeService.getAll(request.query)
            
            return response.json({
                error: false,
                equacoes: data,
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
                equacoes: [],
                message: error.message
            })
        }
    }

    async deleteEquacoes(request: Request, response: Response) {
        const { ids } = request.body
        
        await eqVolumeService.deleteEqVolumes(ids)

        return response.json({
            ids,
            message: 'Equações Volume deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        const { projetoId } = request.params
        const eqVolumes = nome ? await eqVolumeService.search(nome, projetoId) : await eqVolumeService.getAll(request.query, projetoId)
        
        return response.json(eqVolumes)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const eqVolume = await eqVolumeService.findById(id)

            return response.json(eqVolume)
        } catch(error) {
            return response.json(error.message)
        }
    }
}