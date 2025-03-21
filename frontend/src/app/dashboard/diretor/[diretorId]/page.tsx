import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DiretorViewPage from '@/features/diretor/components/diretor-view-page';

export const metadata = {
  title: 'Dashboard : Diretor View'
};

type PageProps = { params: Promise<{ diretorId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DiretorViewPage diretorId={params.diretorId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
