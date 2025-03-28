'use client'

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { OcorrenciaType } from "types";
import { useAuthContext } from "@/context/AuthContext";
import { useCallback } from "react";

import moment from "moment";

export default function OcorrenciaLatest({ limit = 4 }) {
    const { client } = useAuthContext()

    const fetchOcorrencia = useCallback(async (limit: number) => {
        const { data: { ocorrencias } } = await client.get(`/ocorrencia/get-lastest?limit=${limit}`)
        return ocorrencias
    }, [client])

    const { data, isLoading, error } = useQuery({
        queryKey: ["ocorrenciaLatest", limit],
        queryFn: () => fetchOcorrencia(limit),
        // enabled: !!token,
        staleTime: 60000
    });

    return (
        <>
            {isLoading && <Skeleton className="h-24 w-full" />}
            {error && (
            <div className="text-red-500 flex items-center">
                <AlertCircle className="mr-2" /> Erro ao carregar dados
            </div>
            )}
            {data && (
            <ul className="space-y-2">
                {data.map((ocorrencia: OcorrenciaType) => (
                    // <pre>{JSON.stringify(ocorrencia, null, 2)}</pre>
                <li key={ocorrencia.id} className="p-2 border rounded-lg shadow-sm">
                    <div className="flex flex-row items-center justify-between">
                        <p className="text-sm text-gray-600">{moment(ocorrencia?.data).format('DD/MM/yyyy')}</p>
                        <p className="text-sm text-gray-600">{moment(ocorrencia?.hora).format('HH:mm')}</p>
                    </div>
                    <p className="font-medium">{ocorrencia?.unidade_escolar?.pessoa?.pessoaJuridica?.nome_fantasia}</p>
                    <p className="text-sm text-gray-600">{ocorrencia?.tipo_ocorrencia?.nome}</p>
                </li>
                ))}
            </ul>
            )}
        </>
    );
}
