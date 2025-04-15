'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { OcorrenciaType } from 'types';
import moment from 'moment'
import { CellDate } from './cell-date';
import { Modal } from '@/components/ui/modal';
import { OcorrenciaDetalhes } from '../ocorrencia-details';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { CellDetail } from './cell-detail';

export const columns: ColumnDef<OcorrenciaType>[] = [
  // {
  //   id: 'visualizar',
  //   header: '',
  //   cell: ({ row }) => <CellDetail row={row} />
  // },
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
        timeZone: 'America/Sao_Paulo',
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
    cell: ({ row }) => <div className='flex items-center'><CellDetail row={row} /><CellAction data={row.original} /></div>
  }
];
