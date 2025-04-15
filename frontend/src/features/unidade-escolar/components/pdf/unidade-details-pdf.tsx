'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { DiretorType, EnderecoType, EstadoType, MunicipioType } from "types"
import { UnidadeEscolarPdf } from "./unidade-escolar-pdf"

type UnidadeType = {
  nome: string;
  inep?: number;
  zona?: string;
  telefone?: string;
  email?: string;
  diretor?: Omit<DiretorType, 'id' | 'pessoa_id' | 'pessoa'>;
  endereco?: {
    estado?: EstadoType;
    municipio?: MunicipioType;
  } & Omit<EnderecoType, 'id' | 'estado_id' | 'municipio_id'>;
}

const UnidadeDetailsPdf = ({ unidadeId, onClose }: { unidadeId: string, onClose: () => void }) => {
  const { client } = useAuthContext()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUnidade = useCallback(async () => {
    try {
      const response = await client.get(`/unidade/${unidadeId}`)
      setData(response.data)
    } catch (error) {
      console.error('Erro ao carregar unidade:', error)
    } finally {
      setLoading(false)
    }
  }, [client, unidadeId])

  useEffect(() => {
    loadUnidade()
  }, [loadUnidade])

  if (loading || !data) {
    return <p className="text-center py-10">Carregando dados da unidade...</p>
  }

  return (
    <Card className="max-w-3xl mx-auto p-4 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {data.pessoa?.pessoaJuridica?.nome_fantasia}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          INEP: {data.inep ?? 'N/A'} • Zona: {data.zona ?? 'N/A'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold">Contato</h3>
          <Separator className="my-2" />
          <p>
            Telefone: {data.telefone ?? 'N/A'}<br />
            Email: {data.email ?? 'N/A'}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold">Endereço</h3>
          <Separator className="my-2" />
          <p>
            {data.pessoa.endereco?.logradouro}, {data.pessoa.endereco?.numero}<br />
            Bairro: {data.pessoa.endereco?.bairro}<br />
            Município: {data.pessoa.endereco?.municipio?.nome} - {data.pessoa.endereco?.estado?.nome}<br />
            CEP: {data.pessoa.endereco?.cep}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold">Diretor(a)</h3>
          <Separator className="my-2" />
          <p>
            Nome: {data.diretor?.pessoa?.pessoaFisica?.nome}<br />
            RG: {data.diretor?.pessoa?.pessoaFisica?.rg}<br />
            CPF: {data.diretor?.pessoa?.pessoaFisica?.cpf}
          </p>
        </section>
      </CardContent>

      {onClose && (
        <CardFooter>
          <div className="flex flex-row justify-end space-x-2">
            <div>
              <PDFDownloadLink
                document={<UnidadeEscolarPdf data={data} />}
                fileName={`unidade-escolar_${new Date().toISOString().split("T")[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button>
                    {loading ? 'Gerando PDF...' : 'Exportar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
            <div>
              <Button variant="outline" onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default UnidadeDetailsPdf
