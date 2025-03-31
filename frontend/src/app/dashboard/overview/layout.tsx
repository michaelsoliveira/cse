import PageContainer from '@/components/layout/page-container';
import DashboardTotals from '@/features/overview/components/dashboard-totals';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function OverViewLayout({
  ocorrencias,
  pie_stats,
  bar_stats,
  area_stats
}: {
  ocorrencias: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
      return redirect('/auth/signin');
  }
  
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Seja bem vindo, { session?.user?.username} 👋
          </h2>
        </div>
        <DashboardTotals />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {ocorrencias}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
