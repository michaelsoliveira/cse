import { prismaClient } from "../database/prismaClient";

class ViewService {
    async getDashboardTotals() 
    {
        try {
            const total = await prismaClient.totaisDashboard.findUnique({
                where: { id: 1 },
            });
    
            return total
        } catch (error) {
            throw new Error("Erro ao buscar totais do dashboard:", error);
        }
    }

    async getOcorrenciaTiposTotais() 
    {
        try {
            const total = await prismaClient.ocorrenciasTiposTotais.findUnique({
                where: { id: 1 },
            });
    
            return total
        } catch (error) {
            throw new Error("Erro ao buscar ocorrencias tipos totais do dashboard:", error);
        }
    }

    async getOcorrenciaAnual() 
    {
        try {
            const ocorrencias = await prismaClient.ocorrenciasAnual.findMany();
    
            return ocorrencias
        } catch (error) {
            console.log(JSON.stringify(error, null, 2))
            throw new Error("Erro ao buscar ocorrencias anual:", error);
        }
    }
}

export default new ViewService
