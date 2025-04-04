import { Request, Response } from 'express'
import dashboardService from "../services/DashboardService"

export class DashboardController {
    async getDashboardTotals(request: Request, response: Response) {
        try {
            const result: any = await dashboardService.getDashboardTotals();
            
            return response.status(200).json({
                error: false,
                totals: result[0]
            });
        } catch (error) {
            return response.json({
                error: true,
                message: error.message
            })
        }
    }

    async getOcorrenciaTiposTotais(request: Request, response: Response) {
        try {
            const totals = await dashboardService.getOcorrenciaTiposTotais();

        return response.status(200).json({
            error: false,
            totals
        });
        } catch (error) {
            return response.json({
                error: true,
                message: error.message
            })
        }
    }

    async getOcorrenciaAnual(request: Request, response: Response) {
        try {
            const ocorrencias = await dashboardService.getOcorrenciaAnual();
            
        return response.status(200).json({
            error: false,
            ocorrencias
        });
        } catch (error) {
            return response.json({
                error: true,
                message: error.message
            })
        }
    }

    async getOcorrenciasUnidades(request: Request, response: Response) {
        const { limit }: any = request.query
        try {
            const ocorrencias = await dashboardService.getOcorrenciasUnidades(limit);
            
        return response.status(200).json({
            error: false,
            ocorrencias: ocorrencias.map((ocorrencia: any) => {
                return {
                    id: ocorrencia.id,
                    escola: ocorrencia.escola,
                    total: Number(ocorrencia.total_ocorrencias)
                }
            })
        });
        } catch (error) {
            return response.json({
                error: true,
                message: error.message
            })
        }
    }
}