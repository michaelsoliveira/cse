'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { OcorrenciaDataTableSearch } from '@/features/ocorrencia/components/ocorrencia-tables/ocorrencia-data-table-search';
import {
  useOcorrenciaTableFilters
} from './use-ocorrencia-table-filters';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthContext } from '@/context/AuthContext';
import { TipoOcorrenciaType } from 'types';

export default function OcorrenciaTableAction() {
  const {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    classificacao,
    setClassificacao,
    tipoOcorrencia,
    setTipoOcorrencia,
    setPage,
    resetFilters,
    isAnyFilterActive
  } = useOcorrenciaTableFilters();

  const [tiposOcorrencia, setTiposOcorrencia] = useState<Array<TipoOcorrenciaType>>([])
  const { data: session } = useSession()
  const { client } = useAuthContext()
  
  const loadData = useCallback(async () => {
      if (typeof session !== typeof undefined) {
        const { data: { count, unidades } } = await client.get('/unidade?orderBy=pessoa.pessoaJuridica.nome_fantasia&order=asc')
        const { data: tipos } = await client.get('/ocorrencia/get-tipos')
        setTiposOcorrencia(tipos);
      }
    }, [session, client])
  
    useEffect(() => {
      loadData()
    }, [loadData])
  
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <OcorrenciaDataTableSearch
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        tiposOcorrencia={tiposOcorrencia}
        dataFim={dataFim}
        setDataFim={setDataFim}
        classificacao={classificacao}
        setClassificacao={setClassificacao}
        tipoOcorrencia={tipoOcorrencia}
        setTipoOcorrencia={setTipoOcorrencia}
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
