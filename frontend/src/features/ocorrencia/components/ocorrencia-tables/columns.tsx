'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { OcorrenciaType } from 'types';
import moment from 'moment'
import { CellDate } from './cell-date';

export const columns: ColumnDef<OcorrenciaType>[] = [
  {
    accessorKey: 'data',
    header: 'Data da Ocorrência',
    cell: ({ row }) => <CellDate data={row.original.data} />
  },
  {
    accessorKey: 'hora',
    header: 'Hora',
    cell: ({ row }) => { 
      const hora = new Date(row.original.hora!);
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit'
      }).format(hora) }
  },
  {
    accessorKey: 'unidade_escolar.pessoa.pessoaJuridica.nome_fantasia',
    header: 'Instituição'
  },
  {
    accessorKey: 'tipo_ocorrencia.nome',
    header: 'Tipo da Ocorrência'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
