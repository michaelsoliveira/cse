import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AvaliacaoForm from '@/features/unidade-escolar/components/avaliacao-form';
import Link from 'next/link';
import AvaliacaoListing from '@/features/unidade-escolar/components/avaliacao-listing';
import { fetchAPI } from '@/lib/utils';

export const metadata = {
  title: 'Dashboard : Unidade Escolar Avaliações'
};

type PageProps = { params: Promise<{ unidadeId: string }> };

async function fetchOcorrenciasData(unidade_id: string) {
  const data = await fetchAPI(`/unidade/get-avaliacoes/${unidade_id}`, {
    cache: 'no-store',
  });

  return data;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { avaliacoes, error } = await fetchOcorrenciasData(params.unidadeId);
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Avaliações</h2>
        <Link href={`/dashboard/unidade-escolar/${params.unidadeId}/avaliacao/new`}>
            Nova Avaliação
        </Link>
        </div>
        <Suspense fallback={<FormCardSkeleton />}>
          <AvaliacaoListing unidadeId={params.unidadeId} avaliacoes={avaliacoes} />
        </Suspense>
      </div>
    </PageContainer>
  );
}