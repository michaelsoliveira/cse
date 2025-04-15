'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UnidadeEscolarType } from 'types';
import { CellDetail } from './cell-detail';

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
    // accessorKey: 'diretor.pessoa.pessoaFisica.nome',
    header: 'Diretor',
    cell: ({ row }) => {
      return row.original.diretor &&
      row.original.diretor.pessoa &&
      row.original.diretor.pessoa.pessoaFisica &&
      row.original.diretor.pessoa.pessoaFisica.nome
    }
  },
  {
    accessorKey: 'pessoa.endereco.municipio.nome',
    header: 'Município'
  },
  {
    header: 'Ações',
    id: 'actions',
    cell: ({ row }) => <div className='flex items-center'><CellDetail row={row} /><CellAction data={row.original} /></div>
  }
];
