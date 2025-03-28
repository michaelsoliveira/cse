import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import OcorrenciaForm from './ocorrencia-form';
import { OcorrenciaType } from 'types';
import { fetchAPI } from '@/lib/utils';

type TOcorrenciaViewPageProps = {
  ocorrenciaId: string;
};

export default async function OcorrenciaViewPage({
  ocorrenciaId
}: TOcorrenciaViewPageProps) {
  let ocorrencia = null;
  let pageTitle = 'Cadastrar Ocorrência';
  const session = await auth();

  if (session && ocorrenciaId !== 'new') {
    const data = await fetchAPI(`/ocorrencia/${ocorrenciaId}`)
    ocorrencia = data as OcorrenciaType;
    
    if (!ocorrencia) {
      notFound();
    }
    pageTitle = `Editar Ocorrência`;
  }

  return <OcorrenciaForm initialData={ocorrencia} pageTitle={pageTitle} />;
}
