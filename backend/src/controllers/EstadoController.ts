// import { User } from "../entities/User"
import { Request, Response } from "express";
import estadoService from "../services/EstadoService";

export class EstadoController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const estado = await estadoService.create(request.body)
            return response.json({
                error: false,
                estado,
                message: `Estado ${estado.nome} cadastrada com SUCESSO!!!`
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
        const id: number = parseInt(request.params.id)
         try {    
            const estado = await estadoService.update(id, request.body)
            return response.json({
                error: false,
                estado,
                message: `Estado ${estado.nome} atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                estado: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const id: number = parseInt(request.params.id)

        try {
            await estadoService.delete(id)

            return response.status(200).json({
                error: false,
                message: 'Estado deletada com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                estado: null,
                message: error.message
            })
        }
    }

    async getMunicipios(request: Request, response: Response) {
        const estado_id: number = parseInt(request.params.estado_id);
        try {
            const municipios = await estadoService.getMunicipiosByEstado(estado_id)

            return response.json({
                error: false,
                message: null,
                municipios
            })
        } catch (error: any) {
            return response.json({
                error: true,
                message: null,
                municipios: []
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await estadoService.getAll(request.query)
            
            return response.json({
                error: false,
                estados: data,
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
                estados: [],
                message: error.message
            })
        }
    }

    async deleteEstados(request: Request, response: Response) {
        const { ids } = request.body
        
        await estadoService.deleteEstados(ids)

        return response.json({
            ids,
            message: 'Estados deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const estados = nome ? await estadoService.search(nome) : await estadoService.getAll()

        return response.json(estados)
    }

    async findOne(request: Request, response: Response) {
        const id: number = parseInt(request.params.id)
        try {
            const estado = await estadoService.findById(id)

            return response.json(estado)
        } catch(error: any) {
            return response.json(error.message)
        }
    }
}