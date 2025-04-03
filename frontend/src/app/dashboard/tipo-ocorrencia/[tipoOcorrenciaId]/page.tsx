import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import TipoOcorrenciaViewPage from '@/features/tipo-ocorrencia/components/tipo-ocorrencia-view-page';

export const metadata = {
  title: 'Dashboard : Tipo Ocorrência View'
};

type PageProps = { params: Promise<{ tipoOcorrenciaId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TipoOcorrenciaViewPage tipoOcorrenciaId={params.tipoOcorrenciaId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
