import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Comunicante from './comunicante-form';
import { ComunicanteType } from 'types';
import { fetchWithAuth } from '@/lib/utils';

type TDiretorViewPageProps = {
  comunicanteId: string;
};

export default async function ComunicanteViewPage({
  comunicanteId
}: TDiretorViewPageProps) {
  let comunicante = null;
  let pageTitle = 'Cadastrar Comunicante';
  const session = await auth();

  if (session && comunicanteId !== 'new') {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/comunicante/${comunicanteId}`
    const data = await fetchWithAuth(url, session?.accessToken!)
    comunicante = data;
    
    if (!comunicante) {
      notFound();
    }
    pageTitle = `Editar comunicante`;
  }

  return <Comunicante initialData={comunicante} pageTitle={pageTitle} />;
}
