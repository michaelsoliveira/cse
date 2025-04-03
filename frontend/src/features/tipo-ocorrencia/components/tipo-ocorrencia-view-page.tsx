import { notFound } from 'next/navigation';
import TipoOcorrenciaForm from './tipo-ocorrencia-form';
import { fetchAPI } from '@/lib/utils';
import { TipoOcorrenciaType } from 'types';

type TTipoOcorrenciaViewPage = {
  tipoOcorrenciaId: string;
};

export default async function TipoOcorrenciaPageView({
  tipoOcorrenciaId
}: TTipoOcorrenciaViewPage) {
  let tipoOcorrencia = null;
  let pageTitle = 'Cadastrar tipoOcorrencia';

  if (tipoOcorrenciaId !== 'new') {
    const data = await fetchAPI(`/tipoOcorrencia/${tipoOcorrenciaId}`)
    tipoOcorrencia = data as TipoOcorrenciaType;
    
    if (!tipoOcorrencia) {
      notFound();
    }
    pageTitle = `Editar Tipo de Ocorrência`;
  }

  return <TipoOcorrenciaForm initialData={tipoOcorrencia} pageTitle={pageTitle} />;
}
