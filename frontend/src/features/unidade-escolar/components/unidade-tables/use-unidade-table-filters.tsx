'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const ZONA_OPTIONS = [
  { value: 'Rural', label: 'Rural' },
  { value: 'Urbana', label: 'Urbana' }
];
export function useUnidadeTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [zonasFilter, setZonasFilter] = useQueryState(
    'zonas',
    searchParams.zonas.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setZonasFilter(null);

    setPage(1);
  }, [setSearchQuery, setZonasFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!zonasFilter;
  }, [searchQuery, zonasFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    zonasFilter,
    setZonasFilter
  };
}
