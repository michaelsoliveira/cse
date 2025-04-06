'use client'

import { convertToCSV, downloadCSV, formatData, formatHora, getAcionamento } from "@/lib/utils";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

export function ExportButtonOcorrencia({ data }: { data: any }) {
  const handleExport = async () => {
    const preparedData = data?.map((ocorrencia: any) => {
        return {
            Data: formatData({data: ocorrencia?.data}),
            Hora: formatHora({hora: ocorrencia?.hora}),
            Escola: ocorrencia.unidade_escolar.pessoa.pessoaJuridica?.nome_fantasia.toUpperCase(),
            Tipo: ocorrencia.tipo_ocorrencia?.nome.toUpperCase(),
            Comunicante: ocorrencia.comunicante.pessoa.pessoaJuridica?.nome_fantasia.toUpperCase(),
            Acionamento: ocorrencia?.acionamento && getAcionamento(ocorrencia?.acionamento)
        }
    })
    const csv = convertToCSV(preparedData);
    downloadCSV(csv, 'ocorrencias.csv');
  };

  return (
    <Button
        variant='outline'
      onClick={handleExport}
    >
      <Download className='mr-2 h-4 w-4' /> Exportar
    </Button>
  );
}