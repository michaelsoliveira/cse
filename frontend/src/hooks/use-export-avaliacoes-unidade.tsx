import { useQuery } from "@tanstack/react-query";
import useClient from "./use-client";
import { useSearchParams } from "next/navigation";
import { RawAvaliacao } from "@/features/avaliacao-unidade/utils";

export function useExportAvaliacoesUnidade() {
    const client = useClient()

    const params = useSearchParams();
    
    const ano = params.get('ano') ?? '';
    const mes = params.get('mes') ?? '';
    const status = params.get('status') ?? '';
    const unidadeId = params.get('unidade_id') ?? '';

    return useQuery({
        queryKey: ["export-avaliacao", ano, mes, status, unidadeId],
        queryFn: async () => {
          const response = await client.get('/avaliacao-unidade', {
            params: {
              ...(ano && { ano }),
              ...(mes && { mes }),
              ...(status && { status }),
              ...(unidadeId && { unidade_id: unidadeId }),
            }
          });
          const { avaliacoes } = response.data;
      
          return avaliacoes?.map((avaliacao: RawAvaliacao) => ({
            escola: avaliacao.unidade?.pessoa?.pessoaJuridica?.nome_fantasia ?? '-',
            municipio: avaliacao.unidade?.pessoa?.endereco?.municipio.nome,
            ano: avaliacao.ano,
            mes: avaliacao.mes,
            status: avaliacao.status ?? '-'
          }));
        },
        // enabled: !!ano && !!unidadeId
      })
}