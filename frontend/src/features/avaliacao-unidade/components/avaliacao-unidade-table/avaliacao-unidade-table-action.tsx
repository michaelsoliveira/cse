'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useAvaliacaoUnidadeTableFilters
} from './use-avaliacao-unidade-table-filters';
import { AvaliacaoDataTableSearch } from './avaliacao-data-table-search';
import { useUnidades } from '@/hooks/use-unidades';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { Card, CardContent } from '@/components/ui/card';

export default function AvaliacaoUnidadeTableAction() {
  const {
    unidadeId,
    setUnidadeId,
    ano,
    setAno,
    status,
    setStatus,
    setPage,
    resetFilters,
    isAnyFilterActive
  } = useAvaliacaoUnidadeTableFilters();
  const { data: unidades } = useUnidades()
  return (
    <Card className="mb-4 w-full">
      <CardContent className="p-4">
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
          <div className='pt-6'>
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
