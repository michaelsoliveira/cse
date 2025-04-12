'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { EstadoConservacaoUnidadeType } from 'types';
import { getMes, getStatus } from '../../utils';

export const columns: ColumnDef<EstadoConservacaoUnidadeType>[] = [
  {
    accessorKey: 'unidade.pessoa.pessoaJuridica.nome_fantasia',
    header: 'Unidade escolar'
  },
  {
    accessorKey: 'unidade.pessoa.endereco.municipio.nome',
    header: 'Município'
  },
  {
    accessorKey: 'ano',
    header: 'Ano',
  //   cell: ({ row }) => row.original.ano.toString()
  },
  {
    // accessorKey: 'mes',
    header: 'Mês',
    cell: ({ row }) => getMes(row.original.mes)
  },
  {
    // accessorKey: 'status',
    header: 'Situação',
    cell: ({ row }) => getStatus(row.original.status)
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
