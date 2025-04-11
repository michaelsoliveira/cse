import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as OcorrenciaTable } from '@/components/ui/table/data-table';
import { columns } from './ocorrencia-tables/columns';
import { fetchAPI } from '@/lib/utils';

export default async function OcorrenciaListingPage() {
  const page = searchParamsCache.get('page') || 1;
  const pageLimit = searchParamsCache.get('limit') || 10;
  const orderBy = searchParamsCache.get('orderBy') || 'data'
  const order = searchParamsCache.get('orderBy') || 'asc'
  const dataInicio = searchParamsCache.get('dataInicio') || ''
  const dataFim = searchParamsCache.get('dataFim') || ''
  const classificacao = searchParamsCache.get('classificacao_ocorrencia') || ''
  const tipo_ocorrencia = searchParamsCache.get('tipo_ocorrencia') || ''
  
  const data = await fetchAPI(`/ocorrencia?dataInicio=${dataInicio}&dataFim=${dataFim}&classificacao=${classificacao}&tipo_ocorrencia=${tipo_ocorrencia}&page=${page}&limit=${pageLimit}&orderBy=${orderBy}&order=${order}`);
  
  const { ocorrencias, error, count } = data;

  if (!error){
    return (
    <>
      <OcorrenciaTable
        columns={columns}
        data={ocorrencias}
        totalItems={count}
      />
    </>
    );
  }

}

