'use client';

// import { FileUploader } from '@/components/file-uploader';
import { OptionType, SelectSearchable } from '@/components/select-searchable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ReactInputMask from 'react-input-mask';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { 
  // FieldErrors, 
  // SubmitHandler, 
  // useFieldArray, 
  useForm, 
  useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { OcorrenciaType } from 'types';
import { OcorrenciaFormValues, ocorrenciaSchema } from '../utils/form-schema';
import { Textarea } from '@/components/ui/textarea';
import { InputHora } from '@/components/input-hora';
import { ocorrencias_classificacao } from './ocorrencia-tables/use-ocorrencia-table-filters';

export default function OcorrenciaForm({
  initialData,
  pageTitle
}: {
  initialData: OcorrenciaType | null;
  pageTitle: string;
}) {
  const { client } = useAuthContext();
  const { data: session } = useSession();
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [unidades, setUnidades] = useState([])
  const [tiposOcorrencia, setTiposOcorrencia] = useState([])

  const defaultValues = {
    unidade_id: initialData?.unidade_id || '',
    tipo_id: initialData?.tipo_id || '',
    data: initialData?.data || '',
    hora: initialData?.hora || '',
    descricao: initialData?.descricao || '',
    classificacao: initialData?.classificacao || '',
    origem_id: initialData?.origem_id || ''
  }

  const form = useForm<OcorrenciaFormValues>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    watch,
    setValue,
    formState: { errors }
  } = form

  // const fullErrors: FieldErrors<Extract<DiretorFormValues, { hasDiretorData: true}>> = errors

  type FieldName = keyof OcorrenciaFormValues;

  const fields = ['unidade_id', 'tipo_id', 'data', 'hora', 'tipo_id', 'classificacao', 'origem_id']

  const optionsUnidades : OptionType[] = unidades?.map((unidade: any) => {
    return {
        label: unidade?.pessoa.pessoaJuridica.nome_fantasia,
        value: unidade?.id
    }
  })
  
  const optionsTiposOcorrencia : OptionType[] = tiposOcorrencia?.map((tipo: any) => {
      return {
          label: tipo?.nome,
          value: tipo?.id
      }
  })

  function getSelectUnidade(id: string) {
    return optionsUnidades.find((option: any) => option.value === id)
  }

  async function onSubmit(data: OcorrenciaFormValues) {
    try {
      const output = await form.trigger(fields as FieldName[], {
        shouldFocus: true
      });
  
      if (!output) return;

      setLoading(true)
      const response = initialData?.id 
          ? await client.put(`/ocorrencia/${initialData?.id}`, data) 
          : await client.post('/ocorrencia', data)
      const { error, message } = response.data
      if (!error) {
        setLoading(false)
        toast.success(message)
        router.push('/dashboard/ocorrencia')
      } else {
        setLoading(false)
        toast.error(message)
      }
    } catch(error: any) {
      setLoading(false)
      toast.error(error?.message)
    }
  }

  const loadData = useCallback(async () => {
    if (typeof session !== typeof undefined) {
      const { data: { count, unidades } } = await client.get('/unidade?orderBy=pessoa.pessoaJuridica.nome_fantasia&order=asc')
      const { data: tipos } = await client.get('/ocorrencia/get-tipos')
      setUnidades(unidades);
      setTiposOcorrencia(tipos);
    }
  }, [session, client])

  useEffect(() => {
    loadData()
  }, [loadData])

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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <div
              className='gap-4 md:grid md:grid-cols-4 mt-4'
            >
                <FormField
                  control={form.control}
                  name='data'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input 
                          type='date'
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='hora'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <Input placeholder='00:00' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name='unidade_id'
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Local</FormLabel>
                    <SelectSearchable 
                      callback={(e) => { form.setValue('unidade_id', e.value) }} 
                      options={optionsUnidades} 
                      field={getSelectUnidade(field.value)} 
                      placeholder="Selecione uma Unidade..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
    
            
            <FormField
              control={form.control}
              name='tipo_id'
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tipo Ocorrência</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => field.onChange(value) }
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Selecione um Tipo'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='overflow-y-auto max-h-[20rem]'>
                      {optionsTiposOcorrencia?.map((tipo: any) => (
                        <SelectItem key={tipo.value} value={tipo.value.toString()}>
                          {tipo.label}
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
              name='classificacao'
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Classificação</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => field.onChange(value) }
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Selecione um Tipo'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='overflow-y-auto max-h-[20rem]'>
                      {ocorrencias_classificacao?.map((tipo: any) => (
                        <SelectItem key={tipo.value} value={tipo.value.toString()}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> 
            
            <div className='col-span-4'>
            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      className='w-full'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            </div>
            
            <Button 
              type='submit'
              className="mt-4 w-48"
            >Salvar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
