'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { OcorrenciaType } from 'types';

export const columns: ColumnDef<OcorrenciaType>[] = [
  {
    accessorKey: 'data',
    header: 'Data da Ocorrência'
  },
  {
    accessorKey: 'hora',
    header: 'Hora'
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
