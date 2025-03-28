import { notFound } from 'next/navigation';
import DiretorForm from './diretor-form';
import { DiretorType } from 'types';
import { fetchAPI } from '@/lib/utils';

type TDiretorViewPageProps = {
  diretorId: string;
};

export default async function DiretorViewPage({
  diretorId
}: TDiretorViewPageProps) {
  let diretor = null;
  let pageTitle = 'Cadastrar Diretor';

  if (diretorId !== 'new') {
    const data = await fetchAPI(`/diretor/${diretorId}`)
    diretor = data as DiretorType;
    
    if (!diretor) {
      notFound();
    }
    pageTitle = `Editar Diretor`;
  }

  return <DiretorForm initialData={diretor} pageTitle={pageTitle} />;
}
