'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useTipoOcorrenciaTableFilters
} from './use-avaliacao-unidade-table-filters';

export default function UnidadeTableAction() {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useTipoOcorrenciaTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='nome'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
    </div>
  );
}
