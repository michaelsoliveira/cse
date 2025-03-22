import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { DiretorType, EnderecoType, EstadoType, MunicipioType, UnidadeEscolarType } from "types";

type UnidadeDetailsTypeProps = {
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

const UnidadeDetails = ({ data }: { data: UnidadeDetailsTypeProps }) => {
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Informações da Unidade */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><strong>INEP:</strong> {inep}</div>
          <div><strong>Zona:</strong> {zona}</div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {telefone || <span className="text-muted-foreground italic">Não informado</span>}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {email || <span className="text-muted-foreground italic">Não informado</span>}
          </div>
        </CardContent>
      </Card>

      {/* Diretor */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5" />
            Diretor(a)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><strong>Nome:</strong> {diretor?.nome || <span className="text-muted-foreground italic">Não informado</span>}</div>
          <div><strong>RG:</strong> {diretor?.rg || <span className="text-muted-foreground italic">Não informado</span>}</div>
          <div><strong>CPF:</strong> {diretor?.cpf || <span className="text-muted-foreground italic">Não informado</span>}</div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {diretor?.telefone || <span className="text-muted-foreground italic">Não informado</span>}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {diretor?.email || <span className="text-muted-foreground italic">Não informado</span>}
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><strong>Logradouro:</strong> {endereco?.logradouro}</div>
          <div><strong>Número:</strong> {endereco?.numero}</div>
          {endereco?.complemento && (
            <div><strong>Complemento:</strong> {endereco.complemento}</div>
          )}
          <div><strong>Bairro:</strong> {endereco?.bairro}</div>
          <div><strong>Município:</strong> {endereco?.municipio?.nome}</div>
          <div><strong>Estado:</strong> {endereco?.estado?.nome}</div>
          <div><strong>CEP:</strong> {endereco?.cep}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnidadeDetails;
