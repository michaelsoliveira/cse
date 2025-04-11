'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { AvaliacaoUnidadeType } from 'types';

export const columns: ColumnDef<AvaliacaoUnidadeType>[] = [
  {
    accessorKey: 'unidade.pessoa.pessoaJuridica.nome_fantasia',
    header: 'Unidade escolar'
  },
  {
    // accessorKey: 'ano',
    header: 'Ano',
    cell: ({ row }) => row.original.ano.toString()
  },
  {
    accessorKey: 'mes',
    header: 'Mês'
  },
  {
    accessorKey: 'status',
    header: 'Situação'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
