'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useAuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export function PieGraphOcorrencia() {
  const { client } = useAuthContext()
  
  const { data, isLoading, error } = useQuery({
      queryKey: ["ocorrencias-unidades"],
      queryFn: async () => {
        const { data: { ocorrencias, error }} = await client.get(`/dashboard/ocorrencias-unidades?limit=10`)
        
        return ocorrencias
      },
      staleTime: 60000,
      refetchInterval: 1000 * 60,
      refetchOnWindowFocus: true
  });

  const colors = [
    "#8884d8", "#8dd1e1", "#82ca9d", "#ffc658",
    "#ff8042", "#d0ed57", "#a4de6c", "#d88884",
    "#84d8b0", "#c884d8"
  ];
  
  // Exemplo com 10 escolas
  const chartData = data?.map((oc: any) => {
    return {
      name: oc.escola,
      value: oc.total
    }
  });

  const chartConfig = chartData?.map((d: any, idx: number) => {
    return {
      [d.innerRadius]: {
        label: d.escola,
        color: colors[idx]
      }
    }
  }) satisfies ChartConfig;

  const hasData = chartData?.length > 0 && chartData.some((d: any) => d.value > 0);

  const RADIAN = Math.PI / 180;

  const renderLabelInside = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${value}`}
      </text>
    );
  };

  const anoAtual = new Date().getFullYear();

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>As {chartData?.length > 0 && chartData.length} escolas com o maior número de ocorrências</CardTitle>
        <CardDescription>Unidades escolares com mais ocorrências em {anoAtual}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
      {isLoading ? (
          <div className="text-center p-4">Carregando...</div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">Erro ao carregar dados.</div>
        ) : !hasData ? (
          <div className="text-center p-4 text-muted-foreground">Nenhuma ocorrência registrada.</div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                labelLine={false}
                label={renderLabelInside}
              >
                {chartData.map((entry: object, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      {/* <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
