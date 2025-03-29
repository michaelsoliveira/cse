import { Request, Response } from 'express'
import ViewService from "../services/ViewService"

export class ViewController {
    async getDashboardTotals(request: Request, response: Response) {
        try {
            const totals = await ViewService.getDashboardTotals();

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

    async getOcorrenciasTiposTotais(request: Request, response: Response) {
        try {
            const totals = await ViewService.getOcorrenciasTiposTotais();

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
}