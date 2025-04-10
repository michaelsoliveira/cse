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

export default function AvaliacaoUnidadeListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [unidades, setUnidades] = useState([]);
  const { data: session } = useSession()
  const { client } = useAuthContext()
  const [unidadeId, setUnidadeId] = useState<string>("")
  const [ano, setAno] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const loadUnidades = useCallback(async () => {
      if (typeof session !== typeof undefined) {
        const { data: { unidades } } = await client.get('/unidade?orderBy=pessoa.pessoaJuridica.nome_fantasia&order=asc')
        setUnidades(unidades);
      }
    }, [session, client])
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        setUnidadeId(localStorage.getItem("unidade_id") || "");
        setAno(localStorage.getItem("ano") || "");
        setStatus(localStorage.getItem("status") || "");
      }
      loadUnidades()
    }, [loadUnidades])

  const { data, isLoading, error } = useAvaliacoesUnidade({ unidade_id: unidadeId, ano, status });
  const optionsUnidades : OptionType[] = unidades?.map((unidade: any) => {
    return {
        label: unidade?.pessoa.pessoaJuridica.nome_fantasia,
        value: unidade?.id
    }
  })

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
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { header: "Ano", accessorKey: "ano" },
    { header: "Mês", accessorKey: "mes" },
    { header: "Status", accessorKey: "status" },
    { header: "Observação", accessorKey: "obs" },
  ], []);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


    return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 items-center">
        <div className="col-span-2">
          <Label>Unidade escolar</Label>
            <SelectSearchable 
                callback={(v) => handleParamChange("unidade_id", v, setUnidadeId)} 
                options={optionsUnidades} 
                field={optionsUnidades.find((option: any) => option.value === unidadeId)} 
                placeholder="Selecione uma Unidade"
              />
          </div>

          <div>
            <Label>Ano</Label>
            <Select
              value={ano}
              onValueChange={(v) => handleParamChange("ano", v, setAno)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                { [
                    { label: "2024", value: "2024" },
                    { label: "2025", value: "2025" }
                  ].map((option, idx) => (
                    <SelectItem key={idx} value={option.value}>{option.label}</SelectItem>  
                  )) 
                }
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => handleParamChange("status", v, setStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muito_bom">MUITO BOM</SelectItem>
                <SelectItem value="bom">BOM</SelectItem>
                <SelectItem value="ruim">RUIM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      {isLoading ? (
        <p>Carregando avaliações...</p>
      ) : (
        <table className="min-w-full border mt-4 text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className="border p-2 bg-gray-100 text-left"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

        // <AvaliacaoUnidadeTable
        //   columns={columns}
        //   data={data}
        //   totalItems={data?.length ?? 0}
        // />
      );
    }
