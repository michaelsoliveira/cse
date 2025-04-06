import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn, fetchAPI } from '@/lib/utils';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import OcorrenciaListingPage from '@/features/ocorrencia/components/ocorrencia-listing';
import OcorrenciaTableAction from '@/features/ocorrencia/components/ocorrencia-tables/ocorrencia-table-action';
import { ExportButtonOcorrencia } from '@/components/export-button-ocorrencia'; 
import ExportOcorrenciaPdfButton from '@/features/ocorrencia/components/pdf/export-ocorrencia-pdf-button';

export const metadata = {
  title: 'Dashboard: Ocorrências'
};

export const dynamic = 'force-dynamic';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

async function fetchOcorrenciasData() {
  const data = await fetchAPI('/ocorrencia', {
    cache: 'no-store'
  });

  return data;
}

export default async function Page(props: pageProps) {
  const { ocorrencias, error } = await fetchOcorrenciasData();
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Ocorrências'
            description='Gerenciar Ocorrências do Sistema'
          />
          <div className='space-x-2'>
            { !error && (<ExportButtonOcorrencia data={ocorrencias} />) }
            <ExportOcorrenciaPdfButton />
            <Link
              href='/dashboard/ocorrencia/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Adicionar
            </Link>
          </div>
        </div>
        <Separator />
        <OcorrenciaTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <OcorrenciaListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
