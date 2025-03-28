import { notFound } from 'next/navigation';
import UnidadeForm from './unidade-form';
import { UnidadeEscolarType } from 'types';
import { fetchAPI } from '@/lib/utils';

type TUnidadeViewPageProps = {
  unidadeId: string;
};

export default async function UnidadeViewPage({
  unidadeId
}: TUnidadeViewPageProps) {
  let unidade = null;
  let pageTitle = 'Cadastrar Unidade';
  
  if (unidadeId !== 'new') {
    const data = await fetchAPI(`/unidade/${unidadeId}`)
    unidade = data as UnidadeEscolarType;
    
    if (!unidade) {
      notFound();
    }
    pageTitle = `Editar Unidade`;
  }

  return <UnidadeForm initialData={unidade} pageTitle={pageTitle} />;
}
