import { prismaClient } from "../database/prismaClient";

type ocorrenciaAnual = {
    sequencia: number;
    mes: number;
    ano: number;
    total: number;        
}

type OcorrenciasUnidadesType = {
    id: string;
    escola?: string;
    total_ocorrencias?: number;       
}

class ViewService {
    async getDashboardTotals() 
    {
        try {
            const result = await prismaClient.$queryRaw`
                    SELECT * FROM totais_dashboard;
                `;
    
            return result
        } catch (error) {
            throw new Error("Erro ao buscar totais do dashboard:", error);
        }
    }

    async getOcorrenciaTiposTotais() 
    {
        try {
            const result = await prismaClient.$queryRaw`
                    SELECT * FROM ocorrencias_tipo_dashboard;
                `;

            return result
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

    async getOcorrenciasUnidades(limit: number){
        try {
            const ocorrencias = await prismaClient.ocorrenciasUnidades.findMany({
                take: limit
            })
            
            return ocorrencias
        } catch (error) {
            throw new Error("Erro ao buscar ocorrencias anual:", error?.message);
        }
    }
}

export default new ViewService
