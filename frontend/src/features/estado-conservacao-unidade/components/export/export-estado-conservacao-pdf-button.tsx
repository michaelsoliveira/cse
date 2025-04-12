'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { AvaliacaoPdf } from './estado-conservacao-pdf';
import { buttonVariants } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn} from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { agruparAvaliacoesPorEscola } from '../../utils';
import { useExportAvaliacoesUnidade } from '@/hooks/use-export-avaliacoes-unidade';

export default function ExportAvaliacaoPdfButton() {
  const params = useSearchParams();
  const ano = params.get('ano') ?? '';
  const { data, isLoading, error } = useExportAvaliacoesUnidade()
  
  const documentNode = useMemo(() => {
    if (!data) return null;
    return <AvaliacaoPdf avaliacoes={agruparAvaliacoesPorEscola(data)} />;
  }, [data]);

  if (isLoading || !documentNode) return null;

  return (
    <PDFDownloadLink
      onClick={(e) => {
        if (ano === '') {
          e.preventDefault();
          toast.warning('É necessário selecionar o ano'); 
          return;
        }
      }}
      document={documentNode}
      fileName="relatorio_conservacao.pdf"
      className={cn(buttonVariants({ variant: 'outline' }), 'ml-2 text-xs md:text-sm')}
    >
      {({ loading }) => (
        <>
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Gerando PDF...' : 'Exportar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
