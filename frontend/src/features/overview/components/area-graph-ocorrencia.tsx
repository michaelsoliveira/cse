'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export function AreaGraphOcorrencia() {
  const { client } = useAuthContext()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ocorrencias-anual"],
    queryFn: async () => {
      const response = await client.get('/dashboard/ocorrencia-anual')
      const { ocorrencias, error } = response.data
      return ocorrencias
    },
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p className="text-red-500">Erro ao carregar os dados.</p>;

  // Processa os dados para o gráfico
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

  const dadosProcessados = meses.map((mes, index) => {
    const dadosAtual = data?.find((d: any) => d.mes === index + 1 && d.ano === anoAtual) || { total: 0 };
    const dadosAnterior = data?.find((d: any) => d.mes === index + 1 && d.ano === anoAnterior) || { total: 0 };
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
      <CardHeader>
        <CardTitle>Comparação de Ocorrências ({anoAtual} x {anoAnterior})</CardTitle>
        <CardDescription>
          Exibe a relação de ocorrências do ano atual com o ano anterior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dadosProcessados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <CartesianGrid strokeDasharray="3 3" />
            <Area type="monotone" dataKey={`${anoAnterior}`} stroke="#8884d8" fill="url(#colorAnterior)" />
            <Area type="monotone" dataKey={`${anoAtual}`} stroke="#82ca9d" fill="url(#colorAtual)" />
          </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Mês com maior número de ocorrências <TrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Janeiro - Dezembro {anoAtual}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
