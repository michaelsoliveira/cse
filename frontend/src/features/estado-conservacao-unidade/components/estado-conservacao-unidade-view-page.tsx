import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { EstadoConservacaoUnidadeType } from 'types';
import { fetchAPI } from '@/lib/utils';
import EstadoConservacaoUnidadeForm from './estado-conservacao-unidade-form';

type TEstadoConservacaoViewPageProps = {
  estadoConservacaoId: string;
};

export default async function EstadoConservacaoViewPage({
  estadoConservacaoId
}: TEstadoConservacaoViewPageProps) {
  let estadoConservacaoUnidade = null;
  let pageTitle = 'Cadastro de Avaliação de Unidade';
  const session = await auth();

  if (session && estadoConservacaoId !== 'new') {
    const data = await fetchAPI(`/avaliacao-unidade/${estadoConservacaoId}`)
    estadoConservacaoUnidade = data as EstadoConservacaoUnidadeType;
    
    if (!estadoConservacaoUnidade) {
      notFound();
    }
    pageTitle = `Editar Avaliação de Unidade`;
  }

  return <EstadoConservacaoUnidadeForm initialData={estadoConservacaoUnidade} pageTitle={pageTitle} />;
}
