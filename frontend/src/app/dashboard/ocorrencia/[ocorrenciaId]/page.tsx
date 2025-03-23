import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import OcorrenciaViewPage from '@/features/ocorrencia/components/ocorrencia-view-page';

export const metadata = {
  title: 'Dashboard : Ocorrência View'
};

type PageProps = { params: Promise<{ ocorrenciaId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <OcorrenciaViewPage ocorrenciaId={params.ocorrenciaId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
