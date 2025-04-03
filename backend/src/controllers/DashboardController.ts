import { Request, Response } from 'express'
import dashboardService from "../services/DashboardService"

export class DashboardControoler {
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
}