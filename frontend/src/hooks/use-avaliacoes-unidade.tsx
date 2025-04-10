'use client';

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useClient from "./use-client";

type Avaliacao = {
    id: string;
    unidadeId: string;
    ano: number;
    mes: string;
    status: string;
    observacao: string;
  };
  
  type Params = {
    unidade_id?: string;
    ano?: string;
    status?: string;
  };

export function useAvaliacoesUnidade(params: Params) { 
  const client = useClient()

  return useQuery({
    queryKey: ["avaliacoes", params],
    queryFn: async () => {
      const res = await client.get("/avaliacao-unidade/avaliacoes", { params });
      return res.data;
    },
    enabled: !!params.unidade_id,
  });
}
