'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UnidadeEscolarType } from 'types';

export const columns: ColumnDef<UnidadeEscolarType>[] = [
  {
    accessorKey: 'pessoa.pessoaFisica.nome',
    header: 'Nome'
  },
  {
    accessorKey: 'pessoa.email',
    header: 'Email'
  },
  {
    accessorKey: 'pessoa.telefone',
    header: 'Telefone'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
