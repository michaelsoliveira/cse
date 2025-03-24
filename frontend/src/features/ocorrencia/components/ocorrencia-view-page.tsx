import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import OcorrenciaForm from './ocorrencia-form';
import { OcorrenciaType } from 'types';
import { fetchWithAuth } from '@/lib/utils';

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/ocorrencia/${ocorrenciaId}`
    const data = await fetchWithAuth(url, session?.accessToken!)
    ocorrencia = data as OcorrenciaType;
    
    if (!ocorrencia) {
      notFound();
    }
    pageTitle = `Editar Ocorrência`;
  }

  return <OcorrenciaForm initialData={ocorrencia} pageTitle={pageTitle} />;
}
