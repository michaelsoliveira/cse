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
import { useAvaliacaoUnidadeTableFilters } from './avaliacao-unidade-table/use-avaliacao-unidade-table-filters';

export default function AvaliacaoUnidadeListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const [unidades, setUnidades] = useState([]);
  const { data: session } = useSession()
  const { client } = useAuthContext()
  type ParamKey = 'unidade_id' | 'ano' | 'status';
  
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

  const {
      unidadeId,
      ano,
      status
    } = useAvaliacaoUnidadeTableFilters();

  // useSyncSearchParamsWithLocalStorage(['unidade_id', 'ano', 'status']);

  // const getParam = (key: ParamKey) => searchParams.get(key) || '';

  const { data, isLoading, error } = useAvaliacoesUnidade({ unidade_id: unidadeId, ano, status });

  return (
    <div className="p-4 space-y-4">
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
