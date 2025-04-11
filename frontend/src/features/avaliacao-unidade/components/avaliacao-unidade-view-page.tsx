import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { AvaliacaoUnidadeType } from 'types';
import { fetchAPI } from '@/lib/utils';
import AvaliacaoUnidadeForm from './avaliacao-unidade-form';

type TOcorrenciaViewPageProps = {
  avaliacaoId: string;
};

export default async function OcorrenciaViewPage({
  avaliacaoId
}: TOcorrenciaViewPageProps) {
  let avaliacaoUnidade = null;
  let pageTitle = 'Cadastro de Avaliação de Unidade';
  const session = await auth();

  if (session && avaliacaoId !== 'new') {
    const data = await fetchAPI(`/avaliacao-unidade/${avaliacaoId}`)
    avaliacaoUnidade = data as AvaliacaoUnidadeType;
    
    if (!avaliacaoUnidade) {
      notFound();
    }
    pageTitle = `Editar Avaliação de Unidade`;
  }

  return <AvaliacaoUnidadeForm initialData={avaliacaoUnidade} pageTitle={pageTitle} />;
}
