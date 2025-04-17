'use client'

import { convertToCSV, downloadCSV, formatData, formatHora, getAcionamento } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import { Download } from "lucide-react";
import { useExportAvaliacoesUnidade } from "@/hooks/use-export-avaliacoes-unidade";
import { agruparAvaliacoesPorEscola, meses } from "../../utils";

// Transforma para estrutura tabular de CSV
function prepararDadosParaCSV(avaliacoesPorEscola: any[]) {
  return avaliacoesPorEscola.map((item) => {
    const linha: Record<string, string> = {
      Escola: item.escola,
      Município: item.municipio,
    };

    meses.forEach((mes) => {
      linha[String(mes.value)[0].toUpperCase() + String(mes.value).slice(1)] = item.avaliacoes?.[String(mes.value)] ?? '-';
    });

    return linha;
  });
}

export function ExportButtonAvaliacaoCsv() {
  
  const { data, isLoading, error } = useExportAvaliacoesUnidade()
  const handleExport = async () => {
    const agrupado = agruparAvaliacoesPorEscola(data);
    const csvData = prepararDadosParaCSV(agrupado);
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'conservacao_escola.csv');
  };

  return (
    <>
      { data?.length > 0 && (
        <Button
          variant='outline'
        onClick={handleExport}
      >
        <Download className='mr-2 h-4 w-4' /> Exportar CSV
      </Button>
      ) }
    </>
  );
}