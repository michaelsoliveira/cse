import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { OcorrenciaDetalhes } from "../ocorrencia-details";
import { EyeIcon } from "lucide-react";

export const CellDetail: React.FC<{ row: any }> = ({ row }) => {
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