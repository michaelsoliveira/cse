import { prismaClient } from "../database/prismaClient";

type ocorrenciaAnual = {
    sequencia: number;
    mes: number;
    ano: number;
    total: number;        
}

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
            const ocorrencias = await prismaClient.ocorrenciasAnual.findMany()
            
            return ocorrencias
        } catch (error) {
            throw new Error("Erro ao buscar ocorrencias anual:", error?.message);
        }
    }
}

export default new ViewService
