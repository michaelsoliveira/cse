import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UnidadeTable } from '@/components/ui/table/data-table';
import { columns } from './unidade-tables/columns';
import { fetchAPI } from '@/lib/utils';

type UnidadeListingPage = object;

export default async function UnidadeListingPage({}: UnidadeListingPage) {
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = searchParamsCache.get('limit') || 10;
  const zonas = searchParamsCache.get('zonas');
  const orderBy = searchParamsCache.get('orderBy') || 'pessoa.pessoaJuridica.nome_fantasia'
  const order = searchParamsCache.get('orderBy') || 'asc'

  const url = `/unidade?search=${search}&page=${page}&limit=${pageLimit}&orderBy=${orderBy}&order=${order}`
  const urlWithZonas = zonas ? `${url}&zonas=${zonas}` : url
  try {
    const data = await fetchAPI(urlWithZonas)
  
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
  } catch(error) {
    console.log(JSON.stringify(error))
  }

}
