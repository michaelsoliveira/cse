'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React, { ReactNode, useState, useTransition } from 'react';
import { ocorrencias_classificacao } from './use-ocorrencia-table-filters';
import { OptionType } from '@/components/select-searchable';
import { TipoOcorrenciaType } from 'types';

interface DataTableSearchProps {
  dataInicio: string;
  dataFim: string;
  classificacao: string;
  tiposOcorrencia: Array<TipoOcorrenciaType>
  tipoOcorrencia: string;
  setTipoOcorrencia: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setDataInicio: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setDataFim: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setClassificacao: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  children: ReactNode;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

export function OcorrenciaDataTableSearch({
  dataInicio,
  dataFim,
  tiposOcorrencia,
  tipoOcorrencia,
  setTipoOcorrencia,
  setDataInicio,
  setDataFim,
  setClassificacao,
  classificacao,
  setPage,
  children
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();
  const handleDataInicio = (value: string) => {
    setDataInicio(value, { startTransition });
    setPage(1);
  };

  const handleTipoOcorrencia = (value: string) => {
    setTipoOcorrencia(value, { startTransition });
    setPage(1);
  }

  const handleDataFim = (value: string) => {
    setDataFim(value, { startTransition });
    setPage(1); // Reset page to 1 when search changes
  };

  const handleDataClassificacao = (value: string) => {
    setClassificacao(value);
    setPage(1); // Reset page to 1 when search changes
  };

  const optionsTiposOcorrencia : OptionType[] = tiposOcorrencia?.map((tipo: any) => {
        return {
            label: tipo?.nome,
            value: tipo?.id
        }
    })

  return (
    <Card className="mb-4 w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                type='date'
                value={dataInicio}
                onChange={(e) => handleDataInicio(e.target.value)}
                className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
              />
          </div>

          {/* Data Fim */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              type='date'
              value={dataFim}
              onChange={(e) => handleDataFim(e.target.value)}
              className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
            />
          </div>

          {/* Classificação */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="classificacao">Classificação</Label>
            <Select
              value={classificacao}
              onValueChange={(value) => handleDataClassificacao(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                { ocorrencias_classificacao.map((option, idx) => (
                  <SelectItem key={idx} value={option.value}>{option.label}</SelectItem>  
                )) 
                }
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col space-y-1'>
            <Label htmlFor="tipo_ocorrencia">Tipo Ocorrência</Label>
            <Select
              onValueChange={(value) => handleTipoOcorrencia(value) }
              value={tipoOcorrencia}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder='Selecione'
                />
              </SelectTrigger>
              <SelectContent className='overflow-y-auto max-h-[20rem]'>
                {optionsTiposOcorrencia?.map((tipo: any) => (
                  <SelectItem key={tipo.value} value={tipo.value.toString()}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            { children }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
