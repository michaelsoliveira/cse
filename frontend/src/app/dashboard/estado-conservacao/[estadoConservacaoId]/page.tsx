import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AvaliacaoUnidadeViewPage from '@/features/estado-conservacao-unidade/components/estado-conservacao-unidade-view-page';

export const metadata = {
  title: 'Dashboard : Estado Conservação View'
};

type PageProps = { params: Promise<{ estadoConservacaoId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AvaliacaoUnidadeViewPage estadoConservacaoId={params.estadoConservacaoId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
