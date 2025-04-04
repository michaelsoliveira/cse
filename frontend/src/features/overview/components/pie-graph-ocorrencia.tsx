'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Cell, Label, Legend, Pie, PieChart, Tooltip } from 'recharts';

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
      id: oc.id,
      escola: oc.escola,
      total: oc.total
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

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Mais Ocorrências</CardTitle>
        <CardDescription>Unidades escolares com mais ocorrências</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
      <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="escola"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {chartData?.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={40} />
          </PieChart>
          {/* <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='total'
              nameKey='escola'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          Escolas
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart> */}
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
