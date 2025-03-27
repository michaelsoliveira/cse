'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const ocorrencias_classificacao = [
  { value: 'seguranca_patrimonial', label: 'Segurança Patrimônial' },
  { value: 'seguranca_escolar', label: 'Segura Escolar' }
];

export function useOcorrenciaTableFilters() {
  const [dataInicio, setDataInicio] = useQueryState(
    'dataInicio',
    searchParams.dataInicio
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [dataFim, setDataFim] = useQueryState(
    'dataFim',
    searchParams.dataFim
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [classificacao, setClassificacao] = useQueryState(
    'classificacao_ocorrencia',
    searchParams.classificacao_ocorrencia.withOptions({ shallow: false }).withDefault('')
  );

  const [tipoOcorrencia, setTipoOcorrencia] = useQueryState(
    'tipo_ocorrencia',
    searchParams.tipo_ocorrencia.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setDataInicio(null);
    setDataFim(null);
    setClassificacao(null)
    setTipoOcorrencia(null)
    setPage(1);
  }, [setDataInicio, setDataFim, setClassificacao, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!dataInicio || !!dataFim || !!classificacao || !!tipoOcorrencia;
  }, [dataInicio, dataFim, classificacao, tipoOcorrencia]);

  return {
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    classificacao,
    setClassificacao,
    tipoOcorrencia, 
    setTipoOcorrencia
  };
}
