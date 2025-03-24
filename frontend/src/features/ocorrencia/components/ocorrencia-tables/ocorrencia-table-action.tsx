'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { OcorrenciaDataTableSearch } from '@/features/ocorrencia/components/ocorrencia-tables/ocorrencia-data-table-search';
import {
  useOcorrenciaTableFilters
} from './use-ocorrencia-table-filters';

export default function OcorrenciaTableAction() {
  const {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    classificacao,
    setClassificacao,
    setPage,
    resetFilters,
    isAnyFilterActive
  } = useOcorrenciaTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <OcorrenciaDataTableSearch
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        classificacao={classificacao}
        setClassificacao={setClassificacao}
        setPage={setPage}
      >
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </OcorrenciaDataTableSearch>
    </div>
  );
}
