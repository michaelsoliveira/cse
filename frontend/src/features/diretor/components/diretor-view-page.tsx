import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import UnidadeForm from './diretor-form';
import { UnidadeEscolarType } from 'types';
import { fetchWithAuth } from '@/lib/utils';

type TUnidadeViewPageProps = {
  unidadeId: string;
};

export default async function UnidadeViewPage({
  unidadeId
}: TUnidadeViewPageProps) {
  let unidade = null;
  let pageTitle = 'Cadastrar Unidade';
  const session = await auth();

  if (session && unidadeId !== 'new') {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/unidade/${unidadeId}`
    // const data = await client.get(url)
    const data = await fetchWithAuth(url, session?.accessToken!)
    unidade = data as UnidadeEscolarType;
    
    if (!unidade) {
      notFound();
    }
    pageTitle = `Editar Unidade`;
  }

  return <UnidadeForm initialData={unidade} pageTitle={pageTitle} />;
}
