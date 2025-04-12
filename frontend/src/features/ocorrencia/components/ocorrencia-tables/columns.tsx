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

export const columns: ColumnDef<OcorrenciaType>[] = [
  {
    id: 'visualizar',
    header: '',
    cell: ({ row }) => {
      const ocorrencia = row.original;
      const [open, setOpen] = useState<boolean>(false);
      return (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          trigger={<div onClick={() => setOpen(true)} className='flex items-center justify-center'><EyeIcon className="w-5 h-5 cursor-pointer" /></div>}
          title="Detalhes da Ocorrência"
          description='Visualizar os detalhes da ocorrência'
          className='max-w-[680px]'
        >
          <OcorrenciaDetalhes ocorrencia={ocorrencia} onClose={() => setOpen(false)} />
        </Modal>
      );
    }
  },
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
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
