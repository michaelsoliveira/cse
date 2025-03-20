'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UnidadeEscolarType } from 'types';

export const columns: ColumnDef<UnidadeEscolarType>[] = [
  {
    accessorKey: 'inep',
    header: 'Cod. INEP'
  },
  {
    accessorKey: 'pessoa.pessoaJuridica.nome_fantasia',
    header: 'Escola'
  },
  {
    accessorKey: 'diretor.pessoa.pessoaFisica.nome',
    header: 'Diretor'
  },
  {
    accessorKey: 'pessoa.endereco.municipio',
    header: 'Município'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
