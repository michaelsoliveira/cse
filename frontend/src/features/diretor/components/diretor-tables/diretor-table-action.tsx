'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  ZONA_OPTIONS,
  useUnidadeTableFilters
} from './use-diretor-table-filters';

export default function UnidadeTableAction() {
  const {
    zonasFilter,
    setZonasFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useUnidadeTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='nome'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='zonas'
        title='Zonas'
        options={ZONA_OPTIONS}
        setFilterValue={setZonasFilter}
        filterValue={zonasFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
