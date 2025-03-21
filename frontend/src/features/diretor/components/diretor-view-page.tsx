import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import DiretorForm from './diretor-form';
import { DiretorType } from 'types';
import { fetchWithAuth } from '@/lib/utils';

type TDiretorViewPageProps = {
  diretorId: string;
};

export default async function DiretorViewPage({
  diretorId
}: TDiretorViewPageProps) {
  let diretor = null;
  let pageTitle = 'Cadastrar Diretor';
  const session = await auth();

  if (session && diretorId !== 'new') {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/diretor/${diretorId}`
    const data = await fetchWithAuth(url, session?.accessToken!)
    diretor = data as DiretorType;
    
    if (!diretor) {
      notFound();
    }
    pageTitle = `Editar Diretor`;
  }

  return <DiretorForm initialData={diretor} pageTitle={pageTitle} />;
}
