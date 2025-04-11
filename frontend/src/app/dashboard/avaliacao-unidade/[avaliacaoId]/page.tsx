import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AvaliacaoUnidadeViewPage from '@/features/avaliacao-unidade/components/avaliacao-unidade-view-page';

export const metadata = {
  title: 'Dashboard : Ocorrência View'
};

type PageProps = { params: Promise<{ avaliacaoId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <AvaliacaoUnidadeViewPage avaliacaoId={params.avaliacaoId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
