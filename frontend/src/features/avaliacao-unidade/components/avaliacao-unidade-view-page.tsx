import { notFound } from 'next/navigation';
import TipoOcorrenciaForm from './avaliacao-unidade-form';
import { fetchAPI } from '@/lib/utils';
import { TipoOcorrenciaType } from 'types';

type TTipoOcorrenciaViewPage = {
  tipoOcorrenciaId: string;
};

export default async function TipoOcorrenciaPageView({
  tipoOcorrenciaId
}: TTipoOcorrenciaViewPage) {
  let tipoOcorrencia = null;
  let pageTitle = 'Cadastrar Tipo de Ocorrência';

  if (tipoOcorrenciaId !== 'new') {
    const data = await fetchAPI(`/tipo-ocorrencia/${tipoOcorrenciaId}`)
    tipoOcorrencia = data as TipoOcorrenciaType;
    
    if (!tipoOcorrencia) {
      notFound();
    }
    pageTitle = `Editar Tipo de Ocorrência`;
  }

  return <TipoOcorrenciaForm initialData={tipoOcorrencia} pageTitle={pageTitle} />;
}
