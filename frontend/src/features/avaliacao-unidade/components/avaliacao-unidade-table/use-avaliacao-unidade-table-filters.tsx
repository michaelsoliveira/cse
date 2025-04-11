'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo } from 'react';

const PARAM_KEYS = ['unidade_id', 'ano', 'status', 'page'] as const;

type ParamKey = (typeof PARAM_KEYS)[number];

export function useAvaliacaoUnidadeTableFilters() {
  const [unidadeId, setUnidadeId] = useQueryState(
    'unidade_id',
    searchParams.unidade_id.withDefault('')
  );

  const [ano, setAno] = useQueryState(
    'ano',
    searchParams.ano.withDefault('')
  );

  const [status, setStatus] = useQueryState(
    'status',
    searchParams.status.withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  // Sincroniza localStorage → URL (apenas se vazio)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!unidadeId) setUnidadeId(localStorage.getItem('unidade_id') || '');
    if (!ano) setAno(localStorage.getItem('ano') || '');
    if (!status) setStatus(localStorage.getItem('status') || '');
  }, [unidadeId, ano, status, setUnidadeId, setAno, setStatus]);

  // Salva no localStorage ao alterar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (unidadeId) localStorage.setItem('unidade_id', unidadeId);
    if (ano) localStorage.setItem('ano', ano);
    if (status) localStorage.setItem('status', status);
  }, [unidadeId, ano, status]);

  // Limpar filtros e localStorage
  const resetFilters = useCallback(() => {
    setUnidadeId(null);
    setAno(null);
    setStatus(null);
    setPage(1);

    if (typeof window !== 'undefined') {
      PARAM_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  }, [setUnidadeId, setAno, setStatus, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!unidadeId || !!ano || !!status;
  }, [unidadeId, ano, status]);

  return {
    unidadeId,
    setUnidadeId,
    ano,
    setAno,
    status,
    setStatus,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
