'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { OptionType, SelectSearch } from '@/components/select-search'
import { useUnidades } from '@/hooks/use-unidades'
import { useAuthContext } from '@/context/AuthContext'
import { YearSelect } from '@/components/year-select'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AvaliacaoUnidadeType } from 'types'
import { useRouter } from 'next/navigation'

import { meses, statusOptions } from '../utils'

const avaliacaoSchema = z.object({
  unidade_id: z.string().min(1),
  ano: z.string().min(4, 'Ano inválido'),
  mes: z.enum(meses.map(m => m.value) as [string, ...string[]]),
  status: z.enum(statusOptions.map(s => s.value) as [string, ...string[]]),
  obs: z.string().optional()
})

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>

export default function AvaliacaoUnidadeForm({
  initialData,
  pageTitle
}: {
  initialData: AvaliacaoUnidadeType | null;
  pageTitle: string;
}) {
  const form = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      unidade_id: initialData?.unidade_id || '',
      ano: initialData?.ano || new Date().getFullYear().toString(),
      mes: initialData?.mes || '',
      status: initialData?.status || '',
      obs: initialData?.obs || ''
    }
  })
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false)
  const { client } = useAuthContext()
  const { data: unidades } = useUnidades()
  const router = useRouter()
  const optionsUnidades = unidades?.map((unidade: any) => {
    return {
      label: unidade.pessoa.pessoaJuridica.nome_fantasia,
      value: unidade.id
    }
})

const filterUnidades = async (inputValue: string, callback: (options: OptionType[]) => void) => {
  const response = await client.get('/unidade', {
    params: {
      search: inputValue
    }
  })
  const { unidades } = response.data

  callback(unidades?.map((unidade: any) => ({
      label: unidade.pessoa.pessoaJuridica.nome_fantasia,  
      value: unidade.id
    })))
  }

  type FieldName = keyof AvaliacaoFormData;
  
  const fields = ['unidade_id', 'ano', 'mes', 'status', 'obs']

  const onSubmit = async (data: AvaliacaoFormData) => {
    try {
      const output = await form.trigger(fields as FieldName[], {
        shouldFocus: true
      });
  
      if (!output) return;

      setLoading(true)
      const response = initialData?.id 
          ? await client.put(`/avaliacao-unidade/${initialData?.id}`, data) 
          : await client.post('/avaliacao-unidade', data)
      const { error, message } = response.data
      if (!error) {
        setLoading(false)
        toast.success(message)
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["avaliacoes"] })
        ]);
        router.push('/dashboard/avaliacao-unidade')
      } else {
        setLoading(false)
        toast.error(message)
      }
    } catch(error: any) {
      setLoading(false)
      toast.error(error?.message)
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div
                className='gap-4 w-full flex flex-col md:grid md:grid-cols-5 mt-4'
              >
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name="unidade_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade escolar</FormLabel>
                        <FormControl>
                          <SelectSearch
                            disabled={loading}
                            defaultOptions={optionsUnidades}
                            options={filterUnidades}
                            placeholder='Entre com as iniciais da unidade escolar ...'
                            {...field}
                            value={optionsUnidades.find((unidade: OptionType) => unidade.value === field.value)}
                            onChange={(v) => form.setValue('unidade_id', v.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="ano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <YearSelect disabled={loading} placeholder="2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês</FormLabel>
                      <Select 
                        disabled={loading}
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
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
                  name="status"
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
                <div className='col-span-3'></div>
                <div className='col-span-3'>
                  <FormField
                    control={form.control}
                    name="obs"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea style={{ height: 100 }} placeholder="Opcional" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-2'></div>
              <Button type="submit" className="w-full md:w-auto">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
