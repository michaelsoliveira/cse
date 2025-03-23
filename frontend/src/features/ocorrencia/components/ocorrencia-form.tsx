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
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function DiretorForm({
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
    control,
    // formState: { errors }
  } = form;

  // const fullErrors: FieldErrors<Extract<DiretorFormValues, { hasDiretorData: true}>> = errors

  type FieldName = keyof OcorrenciaFormValues;

  const fields = ['unidade_id', 'tipo_id', 'data', 'hora', 'tipo_id', 'classificacao', 'origem_id']

  const optionsUnidades : OptionType[] = unidades?.map((estado: any) => {
    return {
        label: estado?.uf,
        value: estado?.id
    }
  })
  
  const optionsTiposOcorrencia : OptionType[] = tiposOcorrencia?.map((municipio: any) => {
      return {
          label: municipio?.nome,
          value: municipio?.id
      }
  })

  function getSelectedUnidade(id: string) {
    return optionsUnidades.find((option: any) => option.value === id)
  }

  function getSelectedTipoOcorrencia(id: string) {
    return optionsTiposOcorrencia.find((option: any) => option.value === id)
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
      const responseUnidades = await client.get('/unidade?orderBy=nome&order=asc')
      const responseTiposOcorrencia = await client.get('/tipo-ocorrencia?orderBy=nome&order=asc')

      const { unidades } = responseUnidades.data
      const { tipos_ocorrencia } = responseTiposOcorrencia.data
      setUnidades(unidades);
      setTiposOcorrencia(tipos_ocorrencia);
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
              className='gap-4 md:grid md:grid-cols-4'
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
                    name='unidade_id'
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Município</FormLabel>
                        <SelectSearchable 
                          callback={(e) => { form.setValue('unidade_id', e.value) }} 
                          options={optionsUnidades} 
                          field={getSelectedUnidade(field.value)} 
                          placeholder="Selecione uma Unidade..."
                          selectStyle="w-[450px]"
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
                    <FormLabel>UF</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder='Selecione um Estado'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='overflow-y-auto max-h-[20rem]'>
                        {optionsTiposOcorrencia?.map((tipo: OptionType) => (
                          <SelectItem key={tipo.value?.toString()!} value={tipo.value?.toString()!}>
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
                name='descricao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='col-span-2'></div>
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
