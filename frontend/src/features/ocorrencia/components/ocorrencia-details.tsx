'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BoletimOcorrenciaPdf } from './pdf/boletim-ocorrencia-pdf';
import { ocorrencias_acionamento, ocorrencias_classificacao } from './ocorrencia-tables/use-ocorrencia-table-filters';

interface OcorrenciaDetalhesProps {
  ocorrencia: any;
  onClose?: () => void;
}

export function OcorrenciaDetalhes({ ocorrencia, onClose }: OcorrenciaDetalhesProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    const imprimir = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `BO-${ocorrencia.id.slice(0, 6)}`
  });

  const data = format(new Date(ocorrencia.data), 'dd/MM/yyyy', { locale: ptBR });
  const hora = format(new Date(ocorrencia.hora), 'HH:mm', { locale: ptBR });
  const nomeEscola = ocorrencia.unidade_escolar?.pessoa?.pessoaJuridica?.nome_fantasia || 'Unidade Escolar';
  const dataAtual = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });

  return (
    <div className="p-6 space-y-6">
      <div ref={componentRef} className="bg-white p-6 border rounded-md space-y-4 text-sm">
        <h2 className="text-center font-bold text-xl">BOLETIM DE OCORRÊNCIA</h2>

        <div className="grid grid-cols-2 gap-4 space-y-2">
          <div><strong>B.O. Nº:</strong> {ocorrencia.id.slice(0, 6)}</div>
          <div><strong>Dia:</strong> {data}</div>
          <div><strong>Hora:</strong> {hora}</div>
          <div><strong>Natureza:</strong> {ocorrencia.tipo_ocorrencia?.nome}</div>
          <div><strong>Classificação:</strong> {ocorrencias_classificacao.find((o: any) => o.value === ocorrencia.classificacao)?.label}</div>
          <div><strong>Local:</strong> {nomeEscola}</div>
          <div><strong>Acionamento:</strong> {ocorrencias_acionamento.find((o: any) => o.value === ocorrencia.acionamento)?.label}</div>
        </div>

        <div>
          <strong>Descrição da Ocorrência:</strong>
          <p className="mt-1 whitespace-pre-wrap">
            {ocorrencia.descricao || "Sem descrição informada."}
          </p>
        </div>

        <p className="text-right italic text-xs mt-4">
          Macapá-AP, {dataAtual}.
        </p>
      </div>
      <div className='flex flex-row items-center justify-between'>
        <div>
            <Button variant='outline' onClick={onClose}>Fechar</Button>
        </div>
        <div className="flex flex-row justify-end space-x-2">
            <div>
                <PDFDownloadLink
                    document={<BoletimOcorrenciaPdf ocorrencia={ocorrencia} />}
                    fileName={`BO-${ocorrencia.id.slice(0, 6)}.pdf`}
                >
                    {({ loading }) =>
                    <Button variant="outline">{loading ? 'Gerando PDF...' : 'Exportar PDF'}</Button>
                    }
                </PDFDownloadLink>
            </div>
            <div>
                <Button onClick={() => imprimir()}>Imprimir</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
