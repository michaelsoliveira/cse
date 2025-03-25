import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as OcorrenciaTable } from '@/components/ui/table/data-table';
import { columns } from './ocorrencia-tables/columns';
import { auth } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

type Ocorrencia = {
  id: string
  data: string
  hora: string
  classificacao: string
  descricao: string
  tipo_ocorrencia: { nome: string }
  unidade_escolar: { nome: string }
  user: { nome: string }
}

type OcorrenciaResponse = {
  data: Ocorrencia[]
  total: number
}

const fetchOcorrencias = async (params: URLSearchParams) => {
  const query = new URLSearchParams(params).toString();
  const session = await auth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ocorrencia?${query}`;
  return await fetchWithAuth(url, session?.accessToken!);
}

export default async function OcorrenciaListingPage() {
  const page = searchParamsCache.get('page') || 1;
  const pageLimit = searchParamsCache.get('limit') || 10;
  const orderBy = searchParamsCache.get('orderBy') || 'data'
  const order = searchParamsCache.get('orderBy') || 'asc'
  const dataInicio = searchParamsCache.get('dataInicio') || ''
  const dataFim = searchParamsCache.get('dataFim') || ''
  const classificacao = searchParamsCache.get('classificacao_ocorrencia') || ''

  const session = await auth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ocorrencia?dataInicio=${dataInicio}&dataFim=${dataFim}&classificacao=${classificacao}&page=${page}&limit=${pageLimit}&orderBy=${orderBy}&order=${order}`
  const data = await fetchWithAuth(url, session?.accessToken!);
  
  // const { data, isLoading, isError } = useQuery<Ocorrencia[]>({
  //   queryKey: ['ocorrencias', params.toString()],
  //   queryFn: () => fetchOcorrencias(params),
  // })
  
  const { ocorrencias, error, count } = data;
  
  if (!error){
    return (
      <OcorrenciaTable
        columns={columns}
        data={ocorrencias}
        totalItems={count}
      />
    );
  }
  

}

