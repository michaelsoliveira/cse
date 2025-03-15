import { Request, Response } from "express";
import sysRefService from "../services/SysRefService";

export class SysRefController {
    async store(request : Request, response: Response) : Promise<Response> {
        try {    
            const sysRef = await sysRefService.create(request.body)
            return response.json({
                error: false,
                sysRef,
                message: `Estado ${sysRef.srtext} cadastrada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                sysRef: null,
                message: error.message
            })
        }
    }

     async update(request : Request, response: Response) : Promise<Response> {
        const { srid } = request.params
         try {    
            const sysRef = await sysRefService.update(Number.parseInt(srid), request.body)
            return response.json({
                error: false,
                sysRef,
                message: `Sistema de coordenada ${sysRef.srtext} atualizada com SUCESSO!!!`
            })

        } catch (error: any) {
            return response.json({
                error: true,
                sysRef: null,
                message: error.message
            })
        }
     }
    
    async delete(request: Request, response: Response): Promise<any> {
        const { id } = request.params

        try {
            await sysRefService.delete(Number.parseInt(id))

            return response.status(200).json({
                error: false,
                message: 'Sistema de Coordenada deletado com Sucesso!!!'
            })
        } catch (error: any) {
            return response.json({
                error: true,
                sysRef: null,
                message: error.message
            })
        }
    }

    async findAll(request: Request, response: Response) {
        try {
            const { data, perPage, page, orderBy, order, skip, count } = await sysRefService.getAll(request.query)

            return response.json({
                error: false,
                sysRefs: data,
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
                sysRefs: [],
                message: error.message
            })
        }
    }

    async deleteUmfs(request: Request, response: Response) {
        const { ids } = request.body
        
        await sysRefService.deleteSysRef(ids)

        return response.json({
            ids,
            message: 'Sistemas de Coordenadas deletadas com sucesso',
            error: false
        })   
    }

    async search(request: Request, response: Response) {
        const { nome } = request.query
        
        const sysRefs = nome ? await sysRefService.search(nome) : await sysRefService.getAll()

        return response.json(sysRefs)
    }

    async findOne(request: Request, response: Response) {
        const { id } = request.params
        try {
            const sysRef = await sysRefService.findById(Number.parseInt(id))

            return response.json(sysRef)
        } catch(error) {
            return response.json(error.message)
        }
    }
}