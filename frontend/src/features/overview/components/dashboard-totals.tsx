'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { School, Calendar, AlertCircle } from "lucide-react";

export default function DashboardTotals() {
  const { client } = useAuthContext()  
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-totals"],
    queryFn: async () => {
      const response = await client.get("/dashboard/totals");
      const { totals, error } = response.data
      return totals
    },
  });

  {isLoading && <Skeleton className="h-24 w-full" />}
  {error && (
    <div className="text-red-500 flex items-center">
        <AlertCircle className="mr-2" /> Erro ao carregar dados
    </div>
  )}

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Escolas</CardTitle>
          <School className="w-6 h-6 text-blue-500" />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center'>
          <p className="text-5xl font-bold">{data?.total_escolas}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Total de escolas cadastradas
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-red-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ocorrências</CardTitle>
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-siren-icon lucide-siren"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 12v6"/></svg>
          </div>
          {/* <AlertOctagon className="w-6 h-6 text-red-500" /> */}
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center'>
          <p className="text-5xl font-bold">{data?.total_ocorrencias}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Total geral de ocorrências
          </CardDescription>
        </CardContent>
      </Card>

      <Card className='bg-purple-300'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ocorrências em {new Date().toLocaleString('pt-BR', { month: 'long' })}</CardTitle>
          <Calendar className="w-6 h-6 text-purple-500" />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center'>
          <p className="text-5xl font-bold">{data?.total_ocorrencias_mes}</p>
          <CardDescription className="text-sm text-muted-foreground">
              Ocorrências ocorridas no mês de {new Date().toLocaleString('pt-BR', { month: 'long' })}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
