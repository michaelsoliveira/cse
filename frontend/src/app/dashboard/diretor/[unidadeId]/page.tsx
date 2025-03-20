import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import UnidadeViewPage from '@/features/unidade-escolar/components/unidade-view-page';

export const metadata = {
  title: 'Dashboard : Unidade Escolar View'
};

type PageProps = { params: Promise<{ unidadeId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UnidadeViewPage unidadeId={params.unidadeId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
