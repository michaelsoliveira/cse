'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { OcorrenciaType } from 'types';
import moment from 'moment'

export const columns: ColumnDef<OcorrenciaType>[] = [
  {
    accessorKey: 'data',
    header: 'Data da Ocorrência',
    cell: ({ row }) => <>{ moment(row.original.data).utcOffset('+03:00').format('DD/MM/yyy') }</>
  },
  {
    accessorKey: 'hora',
    header: 'Hora',
    cell: ({ row }) => <>{ moment(row.original.hora).utcOffset('-03:00').format('HH:mm') }</>
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
