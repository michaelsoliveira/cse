'use client'

import { DataTable as AvaliacaoUnidadeTable } from '@/components/ui/table/data-table';
import { columns } from './avaliacao-unidade-table/columns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAvaliacoesUnidade } from '@/hooks/use-avaliacoes-unidade';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from "@tanstack/react-table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { OptionType, SelectSearchable } from '@/components/select-searchable';
import { useSession } from 'next-auth/react';
import { useAuthContext } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { useSyncSearchParamsWithLocalStorage } from '@/hooks/use-sync-search-params';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useUnidades } from '@/hooks/use-unidades';
import { YearSelect } from '@/components/year-select';
import { statusOptions } from '../utils';

export default function AvaliacaoUnidadeListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const [unidades, setUnidades] = useState([]);
  const { data: session } = useSession()
  const { client } = useAuthContext()
  const [unidadeId, setUnidadeId] = useState<string>("")
  const [ano, setAno] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  function isOptionType(obj: unknown): obj is OptionType {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'label' in obj &&
      'value' in obj &&
      typeof (obj as any).label === 'string' &&
      typeof (obj as any).value === 'string'
    );
  }
  
  type StringOptionType = Pick<OptionType, 'label'> & { value: string };
  
  // Atualiza URL e localStorage ao mudar filtro
  const handleParamChange = (key: string, rawValue: string | StringOptionType, setter: (v: string) => void) => {
    let value: string;
  
    if (isOptionType(rawValue)) {
      value = rawValue.value;
    } else {
      value = rawValue;
    }

    setter(value);
    localStorage.setItem(key, String(value));

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  useSyncSearchParamsWithLocalStorage(['unidade_id', 'ano', 'status']);

  const { data, isLoading, error } = useAvaliacoesUnidade({ unidade_id: unidadeId, ano, status });

  const { data: unidades } = useUnidades()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUnidadeId(localStorage.getItem("unidade_id") || "");
      setAno(localStorage.getItem("ano") || "");
      setStatus(localStorage.getItem("status") || "");
    }
    // loadUnidades()
  }, [])

  
  const optionsUnidades : OptionType[] = unidades?.map((unidade: any) => {
    return {
        label: unidade?.pessoa.pessoaJuridica.nome_fantasia,
        value: unidade?.id
    }
  })

    return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 items-center">
        <div className="col-span-2">
          <Label>Unidade escolar</Label>
            <SelectSearchable 
              callback={(v) => handleParamChange("unidade_id", v, setUnidadeId)} 
              options={optionsUnidades} 
              field={optionsUnidades?.find((option: any) => option.value === unidadeId)} 
              placeholder="Selecione uma Unidade"
            />
          </div>
          <div>
            <Label>Ano</Label>
            <YearSelect value={ano} onChange={(v) => handleParamChange("ano", v, setAno)} />
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={(v) => handleParamChange("status", v, setStatus)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              <SelectContent>
                {statusOptions.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        { data && (
          <AvaliacaoUnidadeTable
            columns={columns}
            data={data.avaliacoes}
            totalItems={data.count}
          />
        ) }
    </div>
      );
    }
