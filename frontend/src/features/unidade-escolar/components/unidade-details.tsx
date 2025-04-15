import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DiretorType, EnderecoType, EstadoType, MunicipioType } from "types";
import { UnidadeEscolarPdf } from "./pdf/unidade-escolar-pdf";
import { Button } from "@/components/ui/button";

export type UnidadeDetailsTypeProps = {
  data: {
    nome: string;
    inep?: number;
    zona?: string
    telefone?: string;
    email?: string;
    diretor?: Omit<DiretorType, 'id' | 'pessoa_id'  | 'pessoa'>;
    endereco?: {
        estado?: EstadoType | undefined,
        municipio?: MunicipioType | undefined,
    } & Omit<EnderecoType, 'id' | 'estado_id' | 'municipio_id'>;  
  }
  onClose?: () => void
}

const UnidadeDetails = ({ data, onClose }: UnidadeDetailsTypeProps ) => {
  const {    
    nome,
    inep,
    zona,
    telefone,
    email,
    diretor,
    endereco,
  } = data;

  return (
    <Card className="max-w-3xl mx-auto p-4 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {nome}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          INEP: {inep} • Zona: {zona}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold">Contato</h3>
          <Separator className="my-2" />
          <p>
            Telefone: {telefone}<br />
            Email: {email}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold">Endereço</h3>
          <Separator className="my-2" />
          <p>
            {endereco?.logradouro}, {endereco?.numero}<br />
            Bairro: {endereco?.bairro}<br />
            Município: {endereco?.municipio?.nome} - {endereco?.estado?.nome}<br />
            CEP: {endereco?.cep}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold">Diretor(a)</h3>
          <Separator className="my-2" />
          <p>
            Nome: {diretor?.nome}<br />
            RG: {diretor?.rg}<br />
            CPF: {diretor?.cpf}
          </p>
        </section>
      </CardContent>
    </Card>
  )
}


export default UnidadeDetails