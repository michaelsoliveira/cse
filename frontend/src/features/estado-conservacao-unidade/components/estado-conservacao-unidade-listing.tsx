'use client'

import { DataTable as AvaliacaoUnidadeTable } from '@/components/ui/table/data-table';
import { columns } from './estado-conservacao-unidade-table/columns';
import { useAvaliacoesUnidade } from '@/hooks/use-avaliacoes-unidade';
import { useAvaliacaoUnidadeTableFilters } from './estado-conservacao-unidade-table/use-estado-conservacao-unidade-table-filters';

export default function AvaliacaoUnidadeListingPage() {
  const {
      unidadeId,
      ano,
      status,
      mes
    } = useAvaliacaoUnidadeTableFilters();

  // useSyncSearchParamsWithLocalStorage(['unidade_id', 'ano', 'status']);

  const { data, isLoading, error } = useAvaliacoesUnidade({ 
    unidade_id: unidadeId, 
    ano, 
    status, 
    mes,
    orderBy: 'unidade.pessoa.pessoaJuridica.nome_fantasia,mes_numero',
    order: 'asc,asc'
  });
  
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
