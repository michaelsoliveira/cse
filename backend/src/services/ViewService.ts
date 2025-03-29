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

    async getOcorrenciasTiposTotais() 
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
}

export default new ViewService
