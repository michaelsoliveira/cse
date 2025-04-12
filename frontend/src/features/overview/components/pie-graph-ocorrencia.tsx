'use client';

import * as React from 'react';
import { DownloadIcon, TrendingUp } from 'lucide-react';
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
import { useCallback, useRef } from 'react';
import { downloadChart } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAnoStore } from '@/stores/useAnoStore';

export function PieGraphOcorrencia() {
  const { client } = useAuthContext()
  const { anoAtivo } = useAnoStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useQuery({
      queryKey: ["ocorrencias-unidades", anoAtivo],
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

  const downloadChartPizza = () => downloadChart({
    chartRef, 
    title: `As ${chartData?.length > 0 && chartData.length} escolas com o maior número de ocorrências`, 
    description: `Unidades escolares com mais ocorrências em ${anoAtual}`
  })

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

  // const renderLegendSVG = () => {
  //   const x = 30; // posição X da legenda SVG
  //   const startY = 225; // posição inicial Y
  //   const itemHeight = 16; // altura entre itens
  //   const fontSize = 10;

  //   return (
  //     <g>
  //       {chartData.map((entry: any, index: number) => {
  //         const y = startY + index * itemHeight;
  //         return (
  //           <g key={`legend-svg-${index}`} transform={`translate(${x}, ${y})`}>
  //             <rect
  //               width={10}
  //               height={10}
  //               fill={colors[index % colors.length]}
  //               rx={2}
  //               ry={2}
  //             />
  //             <text
  //               x={14}
  //               y={9}
  //               fontSize={fontSize}
  //               fontWeight={500}
  //               fill="#333"
  //             >
  //               {entry.name}: {entry.value}
  //             </text>
  //           </g>
  //         );
  //       })}
  //     </g>
  //   );
  // }

  // Componente de legenda customizada
const renderCustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ listStyle: 'none', marginTop: 40, textAlign: 'left' }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
            marginLeft: 20,
            fontSize: '10px', // Tamanho da fonte
            fontWeight: 500,
            color: '#333',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              marginRight: 8,
              marginBottom: 0,
              borderRadius: '50%',
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

  const anoAtual = new Date().getFullYear();

  return (
    <Card className='flex flex-col h-full'>
      <div className='relative inline-block w-full'>
        <div
          ref={chartRef}
        >
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
              <ResponsiveContainer width="100%" height={400}>
                <PieChart
                  margin={{ top: 30, right: 20, left: 0, bottom: 5 }}
                >
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
                  <Legend
                    // layout="vertical"
                    // verticalAlign="middle"
                    align="right"
                    content={renderCustomLegend} // <-- Aponta para a função customizada
                  />
                  {/* {renderLegendSVG()} */}
                </PieChart>
              </ResponsiveContainer>
            )}
        </CardContent>
        </div>
            <Button
              onClick={downloadChartPizza}
              className='absolute top-2 right-2 cursor-pointer'
              variant='outline'
            >
              <DownloadIcon className='h-4 w-4' />
            </Button>
        </div>
    </Card>
  );
}
