'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useAvaliacaoUnidadeTableFilters
} from './use-avaliacao-unidade-table-filters';
import { AvaliacaoDataTableSearch } from './avaliacao-data-table-search';
import { useUnidades } from '@/hooks/use-unidades';

export default function AvaliacaoUnidadeTableAction() {
  const {
    unidadeId,
    setUnidadeId,
    ano,
    setAno,
    status,
    setStatus,
    setPage,
    resetParams,
    isAnyFilterActive
  } = useAvaliacaoUnidadeTableFilters();
  const { data: unidades } = useUnidades()
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <AvaliacaoDataTableSearch
        unidadeId={unidadeId}
        setUnidadeId={setUnidadeId}
        ano={ano}
        unidades={unidades}
        setAno={setAno}
        status={status}
        setStatus={setStatus}
        setPage={setPage}
      />
    </div>
  );
}
