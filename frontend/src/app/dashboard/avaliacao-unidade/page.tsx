import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import AvaliacaoUnidadeListingPage from '@/features/avaliacao-unidade/components/avaliacao-unidade-listing';
import AvaliacaoUnidadeTableAction from '@/features/avaliacao-unidade/components/avaliacao-unidade-table/avaliacao-unidade-table-action';

export const metadata = {
  title: 'Dashboard: Comunicantes'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Avaliações de unidades'
            description='Gerencia as avaliações das unidades escolares'
          />
          <Link
            href='/dashboard/avaliacao-unidade/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Adicionar
          </Link>
        </div>
        <Separator />
        <AvaliacaoUnidadeTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <AvaliacaoUnidadeListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
