'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ComunicanteType } from 'types';

export const columns: ColumnDef<ComunicanteType>[] = [
  {
    // accessorKey: 'pessoa.pessoaFisica.nome',
    header: 'Nome',
    cell: ({ row }) => row.original.pessoa.tipo === 'F' ? row.original.pessoa.pessoaFisica?.nome : row.original.pessoa.pessoaJuridica?.nome_fantasia
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
