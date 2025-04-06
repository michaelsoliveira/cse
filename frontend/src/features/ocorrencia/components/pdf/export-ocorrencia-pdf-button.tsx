'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { OcorrenciaPdf } from './ocorrencia-pdf';
import { buttonVariants } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn, formatData, formatHora, getAcionamento } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

type RawOcorrencia = {
  data: string;
  hora: string;
  unidade_escolar?: {
    pessoa?: {
      pessoaJuridica?: {
        nome_fantasia?: string;
      };
    };
  };
  tipo_ocorrencia?: {
    nome: string;
  };
  acionamento?: string,
  classificacao: string,
  comunicante?: {
    pessoa?: {
      pessoaFisica?: {
        nome?: string;
      };
      pessoaJuridica?: {
        nome_fantasia?: string;
      };
      tipo: 'F' | 'J';
    };
  };
};

type OcorrenciaPdfData = {
  data: string;
  hora: string;
  escola: string;
  tipo: string;
  comunicante: string;
  acionamento: string;
  classificacao: string;
};

export default function ExportOcorrenciaPdfButton() {
  const [data, setData] = useState<OcorrenciaPdfData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { client } = useAuthContext()

  const fetchData = useCallback(async () => {
    try {
      const response = await client.get('/ocorrencia')
      const { ocorrencias, error } = response.data
      
      const parsed: OcorrenciaPdfData[] = ocorrencias?.map((ocorrencia: RawOcorrencia) => {
        const data = formatData({ data: ocorrencia?.data });
        const hora = formatHora({ hora: ocorrencia?.hora });

        const escola =
          ocorrencia.unidade_escolar?.pessoa?.pessoaJuridica?.nome_fantasia ?? '-';

        const tipo = ocorrencia.tipo_ocorrencia?.nome ?? '-';

        const acionamento = ocorrencia?.acionamento && getAcionamento(ocorrencia?.acionamento)

        const classificacao = ocorrencia?.classificacao && ocorrencia.classificacao === "seguranca_patrimonial" ? "Segurança Patrimonial" : "Policiamento Escolar"

        const comunicanteTipo = ocorrencia.comunicante?.pessoa?.tipo;
        let comunicante = '-';

        if (comunicanteTipo === 'F') {
          comunicante =
            ocorrencia.comunicante?.pessoa?.pessoaFisica?.nome ?? 'Pessoa Física';
        } else if (comunicanteTipo === 'J') {
          comunicante =
            ocorrencia.comunicante?.pessoa?.pessoaJuridica?.nome_fantasia ??
            'Pessoa Jurídica';
        }

        return {
          data,
          hora,
          escola,
          tipo,
          comunicante,
          acionamento,
          classificacao
        };
      });
      
      setData(parsed);
    } catch (e) {
      console.error('Erro ao buscar dados das ocorrências:', e);
    } finally {
      setLoading(false);
    }
  }, [client, setData, setLoading])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !data) return null;

  return (
    <PDFDownloadLink
      document={<OcorrenciaPdf ocorrencias={data} />}
      fileName="relatorio_ocorrencias.pdf"
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
