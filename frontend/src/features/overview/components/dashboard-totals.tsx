'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { School, AlertCircle, Calendar } from "lucide-react";

export default function DashboardTotals() {
  const { client } = useAuthContext()  
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-totals"],
    queryFn: async () => {
      const response = await client("/dashboard/totals");
      const { totals, error } = response.data
      return totals;
    },
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Escolas</CardTitle>
          <School className="w-6 h-6 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.total_escolas}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Total de escolas cadastradas
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ocorrências</CardTitle>
          <AlertCircle className="w-6 h-6 text-red-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.total_ocorrencias}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Total geral de ocorrëncias
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ocorrências no Mês</CardTitle>
          <Calendar className="w-6 h-6 text-purple-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.total_ocorrencias_mes}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Total de ocorrëncias ocorridas no mës de {new Date().toLocaleString('pt-BR', { month: 'long' })}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
