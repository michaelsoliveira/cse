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

export function AreaGraphOcorrencia() {
  const chartRef = useRef<HTMLDivElement>(null);
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

  const downloadChart = () => {
    if (chartRef.current === null) return;

    const svgElement = chartRef.current.querySelector("svg");

    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const headerHeight = 80; // Altura reservada para o título e descrição
      canvas.width = svgElement.clientWidth + 30;
      canvas.height = svgElement.clientHeight + 80;
      const ctx = canvas.getContext("2d");
      if (!ctx) return
      // Fundo branco antes de desenhar o gráfico
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

       // Desenhar título
       ctx.fillStyle = "#000000";
       ctx.font = "bold 16px Arial";
       ctx.fillText(`Comparação de Ocorrências (${anoAtual} x ${anoAnterior})`, 20, 30);
 
       // Desenhar descrição
       ctx.font = "12px Arial";
       ctx.fillText("Exibe a relação de ocorrências do ano atual com o ano anterior", 20, 50);

      ctx.drawImage(img, 0, headerHeight);

      // Criar link para download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "grafico.png";
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;

    // toPng(chartRef.current)
    // .then((dataUrl) => {
    //   const link = document.createElement('a');
    //   link.href = dataUrl;
    //   link.download = 'area-graph-ocorrencia.png';
    //   link.click();
    // })
    // .catch((error) => {
    //   console.log('Erro ao capturar o gráfico', error)
    // })
  }

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p className="text-red-500">Erro ao carregar os dados.</p>;

  // Processa os dados para o gráfico
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

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
          ref={chartRef}
        >
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
          onClick={downloadChart}
          className='absolute top-2 right-2 cursor-pointer'
          variant='outline'
        >
          <DownloadIcon className='h-4 w-4' />
        </Button>
      </div>
        
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
