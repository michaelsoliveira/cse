import AvaliacaoForm from '@/features/unidade-escolar/components/avaliacao-form';
import { fetchAPI } from '@/lib/utils';
import { notFound } from 'next/navigation';

type PageProps = { params: Promise<{ unidadeId: string, avaliacaoId: string }> };

export default async function AvaliacaoPage(props: PageProps) {
  const params = await props.params;
  const { unidadeId, avaliacaoId } = params;
  const isNew = avaliacaoId === 'new';

  let avaliacaoData = null;

  if (!isNew) {
    const data = await fetchAPI(`/unidade/${unidadeId}/avaliacao/${avaliacaoId}`, {
      cache: 'no-store',
    });
    if (!data) return notFound();
    avaliacaoData = data;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Nova Avaliação' : 'Editar Avaliação'}
      </h1>
      <AvaliacaoForm unidadeId={unidadeId} defaultData={avaliacaoData} />
    </div>
  );
}
