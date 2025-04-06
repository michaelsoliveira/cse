'use client';

// import { FileUploader } from '@/components/file-uploader';
import { OptionType, SelectSearchable } from '@/components/select-searchable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { ComunicanteType, OcorrenciaType } from 'types';
import { OcorrenciaFormValues, ocorrenciaSchema } from '../utils/form-schema';
import { Textarea } from '@/components/ui/textarea';
import { InputMasked } from '@/components/input-hora';
import { ocorrencias_classificacao, ocorrencias_acionamento } from './ocorrencia-tables/use-ocorrencia-table-filters';
import moment from 'moment';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/file-uploader';

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
  const [comunicantes, setComunicantes] = useState<ComunicanteType[]>([])

  const defaultValues = {
    unidade_id: initialData?.unidade_id || '',
    tipo_id: initialData?.tipo_id || '',
    data: initialData?.data && moment(initialData?.data).format('YYYY-MM-DD') || '',
    hora: initialData?.hora && moment(initialData?.hora).format('HH:mm') || '',
    descricao: initialData?.descricao || '',
    classificacao: initialData?.classificacao || '',
    acionamento: initialData?.acionamento || '',
    comunicante_id: initialData?.comunicante_id || '',
    anexos: initialData?.anexos || [],
    hasAnexoData: false
  }

  const form = useForm<OcorrenciaFormValues>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
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

  const optionsComunicantes : OptionType[] = comunicantes?.map((comunicante: any) => {
    return {
        label: comunicante?.nome,
        value: comunicante?.id
    }
})

  function getSelectUnidade(id: string) {
    return optionsUnidades.find((option: any) => option.value === id)
  }

  const hasAnexoData = useWatch({ control, name: 'hasAnexoData' });

  async function onSubmit(data: OcorrenciaFormValues) {
    console.log(data)
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
      const { data: { unidades } } = await client.get('/unidade?orderBy=pessoa.pessoaJuridica.nome_fantasia&order=asc')
      const { data: { comunicantes } } = await client.get('/comunicante/get-list')
      const { data: tipos } = await client.get('/ocorrencia/get-tipos')
      setUnidades(unidades);
      setComunicantes(comunicantes)
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
              className='gap-4 w-full flex flex-col md:grid md:grid-cols-4 mt-4'
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
                    <InputMasked
                      { ...field }
                      mask='__:__'
                      replacement={{ _: /\d/ }}
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='md:col-span-2'>
                <FormField
                  control={form.control}
                  name='unidade_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instituição</FormLabel>
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
              </div>
            <FormField
              control={form.control}
              name='classificacao'
              render={({ field }) => (
                <FormItem>
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
                          placeholder='Selecione a Classificação'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='overflow-y-auto max-h-[20rem]'>
                      {ocorrencias_classificacao?.map((classificacao: any) => (
                        <SelectItem key={classificacao.value} value={classificacao.value.toString()}>
                          {classificacao.label}
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
              name='tipo_id'
              render={({ field }) => (
                <FormItem>
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
              name='comunicante_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comunicante</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => field.onChange(value) }
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Selecione o Comunicante'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='overflow-y-auto max-h-[20rem]'>
                      {optionsComunicantes?.map((comunicante: any) => (
                        <SelectItem key={comunicante.value} value={comunicante.value.toString()}>
                          {comunicante.label}
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
              name='acionamento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acionamento</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => field.onChange(value) }
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                  <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Selecione o Acionamento'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='overflow-y-auto max-h-[20rem]'>
                      {ocorrencias_acionamento?.map((acionamento: any) => (
                        <SelectItem key={acionamento.value} value={acionamento.value.toString()}>
                          {acionamento.label}
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
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              <div className='mb-4 col-span-2'>
                <FormField
                  control={form.control}
                  name="hasAnexoData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          { initialData?.anexos ? 'Editar Anexos' : 'Cadastrar Anexos' }
                        </FormLabel>
                        <FormDescription>
                          Permite inserir anexos a uma ocorrência
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 md:col-span-3'><Separator /></div>
          { hasAnexoData && (
            <>
              <div className='col-span-4'>
                <span className='text-md'>Anexos</span>
                <Separator />
              </div>
              <div className='col-span-4'>
              <FormField
                  control={form.control}
                  name='anexo'
                  render={({ field }) => (
                    <div className='space-y-6'>
                      <FormItem className='w-full'>
                        <FormLabel>Imagens</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={field.value}
                            onValueChange={field.onChange}
                            maxFiles={4}
                            maxSize={4 * 1024 * 1024}
                            // disabled={loading}
                            // progresses={progresses}
                            // pass the onUpload function here for direct upload
                            // onUpload={uploadFiles}
                            // disabled={isUploading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                </div>
              </>
              )}
              </div>
            <div className='flex flex-row w-full justify-between'>
            <Button 
              onClick={(e) => {e.preventDefault(); router.back();}}
              className="mt-4 w-48 hover:bg-secondary-foreground/50 bg-secondary text-black"
            >Voltar</Button>
            <Button 
              type='submit'
              className="mt-4 w-48"
            >Salvar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
