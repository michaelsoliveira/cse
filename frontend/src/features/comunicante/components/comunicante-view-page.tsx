import { notFound } from 'next/navigation';
import Comunicante from './comunicante-form';
import { fetchAPI } from '@/lib/utils';

type TDiretorViewPageProps = {
  comunicanteId: string;
};

export default async function ComunicanteViewPage({
  comunicanteId
}: TDiretorViewPageProps) {
  let comunicante = null;
  let pageTitle = 'Cadastrar Comunicante';


  if (comunicanteId !== 'new') {
    const data = await fetchAPI(`/comunicante/${comunicanteId}`)
    comunicante = data;
    
    if (!comunicante) {
      notFound();
    }
    pageTitle = `Editar comunicante`;
  }

  return <Comunicante initialData={comunicante} pageTitle={pageTitle} />;
}
