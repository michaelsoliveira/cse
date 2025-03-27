import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ComunicanteTable } from '@/components/ui/table/data-table';
import { columns } from './comunicante-tables/columns';
import { auth } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/utils';

type UnidadeListingPage = object;

export default async function UnidadeListingPage({}: UnidadeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = searchParamsCache.get('limit') || 10;
  const orderBy = searchParamsCache.get('orderBy') || 'pessoa.pessoaFisica.nome'
  const order = searchParamsCache.get('orderBy') || 'asc'

  const session = await auth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/comunicante?search=${search}&page=${page}&limit=${pageLimit}&orderBy=${orderBy}&order=${order}`
  const data = await fetchWithAuth(url, session?.accessToken!)
  
  const { comunicantes, error, count } = data;
  
  if (!error){
    return (
      <ComunicanteTable
        columns={columns}
        data={comunicantes}
        totalItems={count}
      />
    );
  }
  

}
