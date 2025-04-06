'use client'

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext';
import OcorrenciaLatest from '@/features/ocorrencia/components/ocorrencia-latest';
import { fetchAPI } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useCallback } from 'react';
import { RecentOcorrenciasSkeleton } from './recent-ocorrencia-skeleton';

export function RecentOcorrencia() {
  const { client } = useAuthContext()
  const fetchOcorrencia = useCallback(async (limit: number) => {
      const { data: { ocorrencias, error } } = await client.get(`/ocorrencia/get-lastest?limit=${limit}`)
      return ocorrencias
  }, [client])

  const { data, isLoading, error, refetch } = useQuery({
      queryKey: ["ocorrencia-latest"],
      queryFn: () => fetchOcorrencia(4),
      staleTime: 500 * 5,
      refetchInterval: 6000 * 10,
      refetchOnWindowFocus: true
  });
  return (
    <>
      {isLoading ? <RecentOcorrenciasSkeleton /> : (
        <Card className='h-full'>
          <CardHeader>
            <div>
              <CardTitle>Últimas Ocorrências</CardTitle>
              <CardDescription>As últimas ocorrências...</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
            <div className="text-red-500 flex items-center">
                <AlertCircle className="mr-2" /> Erro ao carregar dados
            </div>
            )}
            <div className='space-y-8'>
              <OcorrenciaLatest data={data}/>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
