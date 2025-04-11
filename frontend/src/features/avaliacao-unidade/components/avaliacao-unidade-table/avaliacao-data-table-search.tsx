'use client'

import { OptionType, SelectSearchable } from "@/components/select-searchable"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YearSelect } from "@/components/year-select";
import { useTransition } from "react";
import { UnidadeEscolarType } from "types";
import { statusOptions } from "../../utils";
import { useUnidades } from "@/hooks/use-unidades";

interface DataTableSearchProps {
  unidadeId: string;
  ano: string;
  mes?: string;
  status: string;
  unidades: Array<UnidadeEscolarType>
  setUnidadeId: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setAno: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setMes?: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setStatus: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

export const AvaliacaoDataTableSearch = ({
    unidadeId,
    ano,
    unidades,
    status,
    mes,
    setUnidadeId,
    setAno,
    setMes,
    setStatus,
    setPage,
}: DataTableSearchProps) => {
    const [isLoading, startTransition] = useTransition();
    const handleUnidadeId = (value: string) => {
        setUnidadeId(value, { startTransition });
        setPage(1);
    };

    const handleAno = (value: string) => {
        setAno(value, { startTransition });
        setPage(1);
    };

    const handleMes = (value: string) => {
        setMes && setMes(value, { startTransition });
        setPage(1);
    };

    const handleStatus = (value: string) => {
        setStatus(value, { startTransition });
        setPage(1);
    };

    const optionsUnidades : OptionType[] = unidades?.map((unidade: any) => {
        return {
            label: unidade?.pessoa.pessoaJuridica.nome_fantasia,
            value: unidade?.id
        }
    })
    
    return (
        <div className="flex flex-col md:grid md:grid-cols-4 gap-4 items-center">
        <div className="col-span-2">
          <Label>Unidade escolar</Label>
            <SelectSearchable 
              callback={(e) => handleUnidadeId(e.target.value)} 
              options={optionsUnidades} 
              field={optionsUnidades?.find((option: any) => option.value === unidadeId)} 
              placeholder="Selecione uma Unidade"
            />
          </div>
          <div>
            <Label>Ano</Label>
            <YearSelect value={ano} onChange={(e: any) => handleAno(e.target.value)} />
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={(e: any) => handleStatus(e.target.value)} value={status}>
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
    )
}