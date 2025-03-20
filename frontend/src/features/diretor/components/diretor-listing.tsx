import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UnidadeTable } from '@/components/ui/table/data-table';
import { columns } from './diretor-tables/columns';
import { auth } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/utils';

type UnidadeListingPage = object;

export default async function UnidadeListingPage({}: UnidadeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = searchParamsCache.get('limit') || 10;
  const zonas = searchParamsCache.get('zonas');
  const orderBy = searchParamsCache.get('orderBy') || 'pessoa.pessoaJuridica.nome_fantasia'
  const order = searchParamsCache.get('orderBy') || 'asc'

  const session = await auth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/unidade?search=${search}&page=${page}&limit=${pageLimit}&orderBy=${orderBy}&order=${order}`
  const urlWithZonas = zonas ? `${url}&zonas=${zonas}` : url
  const data = await fetchWithAuth(urlWithZonas, session?.accessToken!)
  
  const { unidades, error, count } = data;
  
  if (!error){
    return (
      <UnidadeTable
        columns={columns}
        data={unidades}
        totalItems={count}
      />
    );
  }
  

}
