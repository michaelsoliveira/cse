'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const meses = [
  { label: 'JANEIRO', value: 'jan' },
  { label: 'FEVEREIRO', value: 'fev' },
  { label: 'MARÇO', value: 'mar' },
  { label: 'ABRIL', value: 'abr' },
  { label: 'MAIO', value: 'mai' },
  { label: 'JUNHO', value: 'jun' },
  { label: 'JULHO', value: 'jul' },
  { label: 'AGOSTO', value: 'ago' },
  { label: 'SETEMBRO', value: 'set' },
  { label: 'OUTUBRO', value: 'out' },
  { label: 'NOVEMBRO', value: 'nov' },
  { label: 'DEZEMBRO', value: 'dez' },
] as const

const statusOptions = [
  { label: 'MUITO BOM', value: 'muito_bom' },
  { label: 'BOM', value: 'bom' },
  { label: 'RUIM', value: 'ruim' },
  { label: 'SEM ACESSO', value: 'sem_acesso' },
] as const

const avaliacaoSchema = z.object({
  unidade_id: z.string().min(1),
  ano: z.string().min(4, 'Ano inválido'),
  avaliacoes: z.array(z.object({
    mes: z.enum(meses.map(m => m.value) as [string, ...string[]]),
    status: z.enum(statusOptions.map(s => s.value) as [string, ...string[]]),
    observacao: z.string().optional()
  })).min(1, 'Adicione pelo menos uma avaliação.')
})

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>

type Props = {
    unidadeId: string
    defaultData?: Partial<AvaliacaoFormData>
  }

export default function AvaliacaoForm({ unidadeId, defaultData }: Props) {
  const form = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      unidade_id: unidadeId,
      ano: defaultData?.ano || new Date().getFullYear().toString(),
      avaliacoes: defaultData?.avaliacoes || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'avaliacoes'
  })

  const onSubmit = (data: AvaliacaoFormData) => {
    console.log('Dados enviados:', data)
    // aqui você pode chamar um mutation com react-query para persistir no backend
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="ano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input placeholder="2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-xl shadow-sm bg-muted">
                <FormField
                  control={form.control}
                  name={`avaliacoes.${index}.mes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o mês" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {meses.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`avaliacoes.${index}.status`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`avaliacoes.${index}.observacao`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Observação</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Opcional" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="w-full md:w-auto"
                >
                  Remover
                </Button>
              </div>
            ))}

            <Button type="button" onClick={() => append({ mes: 'jan', status: 'muito_bom', observacao: '' })}>
              Adicionar Avaliação
            </Button>

            <Button type="submit" className="w-full md:w-auto">
              Salvar Avaliações
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
