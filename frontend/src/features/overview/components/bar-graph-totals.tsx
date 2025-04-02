"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { formatLabel } from "@/lib/utils";
import { BarGraphSkeleton } from "./bar-graph-skeleton";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// const fetchData = async () => {
//   const result = await fetchAPI("/dashboard/ocorrencia-tipos-totais");
//   const { totals, error } = result.data as any
//   return totals
// };

const CustomXAxisTick = (props: any) => {
    const { x, y, angle, payload } = props;
    const lines = formatLabel(payload.value);
  
    return (
      <g transform={`translate(${x},${y}) rotate(${angle})`}>
        <text fontSize={12} fontWeight='bold' textAnchor="end" fill="#333">
          {lines.map((line, index) => (
            <tspan key={index} x={0} dy={index * 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

export function DashboardTiposOcorrencias() {
    const [isClient, setIsClient] = useState<boolean>(false);
    const { client } = useAuthContext()
  
    const fetchData = useCallback(async () => {
        const { data: { totals, error } } = await client.get(`/dashboard/ocorrencia-tipos-totais`)
        return totals
    }, [client])

    useEffect(() => {
        setIsClient(true);
    }, []);
  
    const { data, isLoading, error } = useQuery({
        queryKey: ["ocorrencia-tipos-totais"],
        queryFn: () => fetchData(),
        // enabled: !!token,
        staleTime: 60000,
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: true
    });

    if (!isClient) {
        return null
    }
    
    const chartData = [
      { name: "Furto", value: data?.furto },
      { name: "Roubo", value: data?.roubo },
      { name: "Vulnerabilidade", value: data?.vulnerabilidade },
      { name: "Intrusão", value: data?.intrusao },
      { name: "Ameaça", value: data?.ameaca },
      { name: "Posse de Arma", value: data?.posse_arma },
      { name: "Uso de Arma de Fogo", value: data?.uso_arma },
      { name: "Porte de Arma", value: data?.porte_arma },
      { name: "Danos ao Patrimônio", value: data?.danos_patrimonio },
      { name: "Ameaça à Escola", value: data?.ameaca_escola },
    ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ocorrências por Tipo</CardTitle>
        <CardDescription>Gráfico das ocorrências agrupadas por tipo</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-24 w-full" />}
        {error && (
          <div className="text-red-500 flex items-center">
              <AlertCircle className="mr-2" /> Erro ao carregar dados
          </div>
        )}
        { data && (
          <ResponsiveContainer width="100%" height={375}>
          <BarChart 
            // layout="vertical"
            data={chartData} 
            margin={{bottom: 40, top: 10}}
          >
          <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              interval={0} 
              height={50}
            //   tickFormatter={(label) => formatLabel(label)}
              tick={<CustomXAxisTick />}
            />
            <YAxis 
                interval={1} 
                tick={{fontSize: 12}}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#87CEEB" />
          </BarChart>
        </ResponsiveContainer>
        ) }
      </CardContent>
    </Card>
  );
}
