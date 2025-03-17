import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import UnidadeForm from './unidade-form';
import { useAuthContext } from '@/context/AuthContext';
import { UnidadeEscolarType } from 'types';

type TUnidadeViewPageProps = {
  unidadeId: string;
};

export default async function UnidadeViewPage({
  unidadeId
}: TUnidadeViewPageProps) {
  let unidade = null;
  let pageTitle = 'Cadastro';
  const session = await auth();

  if (unidadeId !== 'new') {
    // const url = `${process.env.NEXT_PUBLIC_API_URL}/unidade/${unidadeId}`
    // const data = await client.get(url)
    // await fetch(url, {
    //     method: "GET",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         "Authorization": `Bearer ${session?.accessToken}`
    //     }
    // }).then((data) => data.json())
    // unidade = data as UnidadeEscolarType;
    
    // if (!unidade) {
    //   notFound();
    // }
    pageTitle = `Editar Unidade Escolar`;
  }

  return <UnidadeForm unidadeId={unidadeId} pageTitle={pageTitle} />;
}
