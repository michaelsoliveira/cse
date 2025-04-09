'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Avaliacao = {
  id: string
  ano: string
  mes: string
  status: string
  observacao?: string
}

type Props = {
  unidadeId: string
  avaliacoes: Avaliacao[]
}

export default function AvaliacaoListing({ unidadeId, avaliacoes }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4">
          {avaliacoes.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma avaliação cadastrada.</p>
          ) : (
            avaliacoes.map((av) => (
              <Card key={av.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{av.ano.toUpperCase()} - {av.mes.toUpperCase()}</p>
                  <p className="text-sm">Status: {av.status.replace('_', ' ')}</p>
                  {av.observacao && <p className="text-sm text-muted-foreground">{av.observacao}</p>}
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/unidade-escolar/${unidadeId}/avaliacao/${av.id}`}>
                    Editar
                  </Link>
                </Button>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
