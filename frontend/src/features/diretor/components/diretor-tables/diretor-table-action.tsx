'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useDiretorTableFilters
} from './use-diretor-table-filters';

export default function UnidadeTableAction() {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useDiretorTableFilters();
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
