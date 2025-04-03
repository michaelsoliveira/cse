'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { DiretorType } from 'types';

export const columns: ColumnDef<DiretorType>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
