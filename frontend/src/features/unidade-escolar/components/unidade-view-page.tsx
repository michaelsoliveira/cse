import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import UnidadeForm from './unidade-form';
import { UnidadeEscolarType } from 'types';
import { fetchWithAuth } from '@/services/fetchWithAuth';

type TUnidadeViewPageProps = {
  unidadeId: string;
};

export default async function UnidadeViewPage({
  unidadeId
}: TUnidadeViewPageProps) {
  let unidade = null;
  let pageTitle = 'Cadastro';
  const session = await auth();

  if (session && unidadeId !== 'new') {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/unidade/${unidadeId}`
    // const data = await client.get(url)
    const data = await fetchWithAuth({url, token: session?.accessToken!})
    unidade = data as UnidadeEscolarType;
    
    if (!unidade) {
      notFound();
    }
    pageTitle = `Editar Unidade Escolar`;
  }

  return <UnidadeForm initialData={unidade} pageTitle={pageTitle} />;
}
