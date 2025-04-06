'use client';

import { DownloadIcon, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toPng } from 'html-to-image'

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
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/context/AuthContext';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { downloadChart, drawRoundedRect } from '@/lib/utils';
import { useAnoStore } from '@/stores/useAnoStore';

export function AreaGraphOcorrencia() {
  const chartCompRef = useRef<HTMLDivElement>(null);
  const { client } = useAuthContext()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ocorrencias-anual"],
    queryFn: async () => {
      const response = await client.get('/dashboard/ocorrencia-anual')
      const { ocorrencias, error } = await response.data
      return ocorrencias
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60,
    staleTime: 60
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p className="text-red-500">Erro ao carregar os dados.</p>;

  // Processa os dados para o gráfico
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

  const downloadChartArea = () => downloadChart({
    chartRef: chartCompRef, 
    title: `Comparação de Ocorrências (${anoAnterior} x ${anoAtual})`, 
    description: "Exibe a relação de ocorrências do ano anterior com o ano atual"}
  )

  const dadosProcessados = meses.map((mes, index) => {
    const dadosAtual = data?.find((d: any) => Number(d.mes) === index + 1 && Number(d.ano) === anoAtual) || { total: 0 };
    const dadosAnterior = data?.find((d: any) => Number(d.mes) === index + 1 && Number(d.ano) === anoAnterior) || { total: 0 };
    return {
      mes,
      [`${anoAnterior}`]: dadosAnterior.total,
      [`${anoAtual}`]: dadosAtual.total,
    };
  });

const chartConfig = {
  [`${anoAnterior}`]: {
    label: anoAtual.toString(),
    color: 'var(--chart-1)'
  },
  [`${anoAtual}`]: {
    label: anoAnterior.toString(),
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;


  return (
    <Card>
      <div className='relative inline-block w-full'>
        <div
          ref={chartCompRef}
          id='chart-comp'
        >
      <CardHeader>
        <CardTitle>Comparação de Ocorrências ({anoAnterior} x {anoAtual})</CardTitle>
        <CardDescription>
          Exibe a relação de ocorrências do ano atual com o ano anterior
        </CardDescription>
      </CardHeader>
      <CardContent>
            <ChartContainer
              config={chartConfig}
              className='aspect-auto h-[310px] w-full'
            >
            <ResponsiveContainer>
              <AreaChart 
                data={dadosProcessados} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                style={{ background: 'transparent' }}
              >
                <defs>
                  <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey={`${anoAnterior}`} stroke="#8884d8" fill="url(#colorAnterior)" />
                <Area type="monotone" dataKey={`${anoAtual}`} stroke="#82ca9d" fill="url(#colorAtual)" />
              </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </div>
        <Button
          onClick={downloadChartArea}
          className='absolute top-2 right-2 cursor-pointer'
          variant='outline'
        >
          <DownloadIcon className='h-4 w-4' />
        </Button>
      </div>
    </Card>
  );
}
