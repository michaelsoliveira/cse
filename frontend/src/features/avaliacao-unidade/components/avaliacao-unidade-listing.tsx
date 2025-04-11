'use client'

import { DataTable as AvaliacaoUnidadeTable } from '@/components/ui/table/data-table';
import { columns } from './avaliacao-unidade-table/columns';
import { useAvaliacoesUnidade } from '@/hooks/use-avaliacoes-unidade';
import { useAvaliacaoUnidadeTableFilters } from './avaliacao-unidade-table/use-avaliacao-unidade-table-filters';

export default function AvaliacaoUnidadeListingPage() {
  const {
      unidadeId,
      ano,
      status
    } = useAvaliacaoUnidadeTableFilters();

  // useSyncSearchParamsWithLocalStorage(['unidade_id', 'ano', 'status']);

  // const getParam = (key: ParamKey) => searchParams.get(key) || '';

  const { data, isLoading, error } = useAvaliacoesUnidade({ unidade_id: unidadeId, ano, status });

  return (<>
      <div className="space-y-4">
          { data && (
            <AvaliacaoUnidadeTable
              columns={columns}
              data={data?.avaliacoes}
              totalItems={data?.count}
            />
          ) 
          }
      </div>
    </>
    );
  }
