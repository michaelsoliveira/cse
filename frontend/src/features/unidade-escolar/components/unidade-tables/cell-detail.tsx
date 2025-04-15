'use client'

import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import UnidadeDetailsPdf from "../pdf/unidade-details-pdf";

export const CellDetail: React.FC<{ row: any }> = ({ row }) => {
    const unidade = row.original;
    const [open, setOpen] = useState<boolean>(false);
    return (
    <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        trigger={<div onClick={() => setOpen(true)} className='flex items-center justify-center'><EyeIcon className="w-5 h-5 cursor-pointer" /></div>}
        title="Detalhes da Unidade Escolar"
        description='Visualizar os detalhes da unidade escolar'
        className='max-w-[680px]'
    >
        <UnidadeDetailsPdf unidadeId={unidade.id} onClose={() => setOpen(false)} />
    </Modal>
    );
}