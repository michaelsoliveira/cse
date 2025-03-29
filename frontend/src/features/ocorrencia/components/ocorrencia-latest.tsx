import { AlertCircle } from "lucide-react";
import { OcorrenciaType } from "types";
import moment from "moment";

export default function OcorrenciaLatest({ data }: any) {
    

    return (
        <>
            { data && (
            <ul className="space-y-2">
                {data.map((ocorrencia: OcorrenciaType) => (
                    // <pre>{JSON.stringify(ocorrencia, null, 2)}</pre>
                <li key={ocorrencia.id} className="p-2 border rounded-lg shadow-sm bg-blue-200">
                    <div className="flex flex-row items-center justify-between">
                        <p className="text-sm text-gray-600">{moment(ocorrencia?.data).format('DD/MM/yyyy')}</p>
                        <p className="text-sm text-gray-600">{moment(ocorrencia?.hora).format('HH:mm')}</p>
                    </div>
                    <p className="font-medium">{ocorrencia?.unidade_escolar?.pessoa?.pessoaJuridica?.nome_fantasia}</p>
                    <p className="text-sm text-gray-600">{ocorrencia?.tipo_ocorrencia?.nome}</p>
                </li>
                ))}
            </ul>
            )}
        </>
    );
}
