import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ComunicanteViewPage from '@/features/comunicante/components/comunicante-view-page';

export const metadata = {
  title: 'Dashboard : Comunicante View'
};

type PageProps = { params: Promise<{ comunicanteId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ComunicanteViewPage comunicanteId={params.comunicanteId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
