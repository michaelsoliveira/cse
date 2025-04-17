'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useAvaliacaoUnidadeTableFilters
} from './use-estado-conservacao-unidade-table-filters';
import { AvaliacaoDataTableSearch } from './estado-conservacao-unidade-data-table-search';
import { useUnidades } from '@/hooks/use-unidades';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { Card, CardContent } from '@/components/ui/card';

export default function AvaliacaoUnidadeTableAction() {
  const {
    unidadeId,
    setUnidadeId,
    mes,
    setMes,
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
        <div className='flex flex-wrap items-end gap-4'>
          <AvaliacaoDataTableSearch
            unidadeId={unidadeId}
            setUnidadeId={setUnidadeId}
            ano={ano}
            mes={mes}
            setMes={setMes}
            unidades={unidades}
            setAno={setAno}
            status={status}
            setStatus={setStatus}
            setPage={setPage}
          />
          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />
        </div>
      </CardContent>
    </Card>
  );
}
