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
import { cn } from '@/lib/utils';
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
import { ComunicanteType, MunicipioType } from 'types';
import { ComunicanteFormValues, comunicanteSchema } from '../utils/form-schema';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function DiretorForm({
  initialData,
  pageTitle
}: {
  initialData: ComunicanteType | null;
  pageTitle: string;
}) {
  const { client } = useAuthContext();
  const { data: session } = useSession();
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const [municipios, setMunicipios] = useState<MunicipioType[]>([]);
  const [estados, setEstados] = useState([])

  const optionsEstados : OptionType[] = estados?.map((estado: any) => {
        return {
            label: estado?.uf,
            value: estado?.id
        }
    })

  const pessoaFisica = initialData?.pessoa?.tipo === 'F' && {
    tipo_pessoa:  'F' as "F",
    pessoaFisica: {
      nome: initialData?.pessoa?.pessoaFisica?.nome || '',
      rg: initialData?.pessoa?.pessoaFisica?.rg || '',
      cpf: initialData?.pessoa?.pessoaFisica?.cpf || ''
    }
  }

  const pessoaJuridica = {
    tipo_pessoa: "J" as "J",
    pessoaJuridica: {
      nome_fantasia: initialData?.pessoa?.pessoaJuridica?.nome_fantasia || '',
      razao_social: initialData?.pessoa?.pessoaJuridica?.razao_social || '',
      inscricao_estadual: initialData?.pessoa?.pessoaJuridica?.inscricao_estadual || '',
      inscricao_federal: initialData?.pessoa?.pessoaJuridica?.inscricao_federal || ''
    }
  }

  type getDataTipo = {
    tipo?: string;
  }

  const getDataTipo = ({ tipo }: getDataTipo) => {
    return tipo === 'F'
      ? pessoaFisica
      : pessoaJuridica
  }

  const defaultValues = {
    telefone: initialData?.pessoa?.telefone || '',
    email: initialData?.pessoa?.email || '',
    endereco: {
      logradouro: initialData?.pessoa?.endereco?.logradouro || '',
      numero: initialData?.pessoa?.endereco?.numero || '',
      complemento: initialData?.pessoa?.endereco?.complemento || '',
      bairro: initialData?.pessoa?.endereco?.bairro || '',
      municipio_id: initialData?.pessoa?.endereco?.municipio_id || 209,
      estado_id: initialData?.pessoa?.endereco?.estado_id || '4',
      cep: initialData?.pessoa?.endereco?.cep || ''
    },
    ...pessoaFisica,
    ...pessoaJuridica
  }

  const form = useForm<ComunicanteFormValues>({
    resolver: zodResolver(comunicanteSchema),
    defaultValues: {
      ...defaultValues,
      hasEnderecoData: false
    },
    mode: 'onChange'
  });

  const {
    control,
    watch
  } = form;

  const tipoPessoa = useWatch({control, name: 'tipo_pessoa'});
  const hasEnderecoData = useWatch({control, name: 'hasEnderecoData'});

  // const fullErrors: FieldErrors<Extract<ComunicanteFormValues, { hasDiretorData: true}>> = errors
  
  type FieldName = keyof ComunicanteFormValues;

  const fields = ['nome', 'email', 'telefone', 'endereco.logradouro', 'endereco.complemento', 'endereco.bairro', 'endereco.municipio', 'endereco.estado_id', 'endereco.municipio_id', 'endereco.cep']
  
  const optionsMunicipios : OptionType[] = municipios?.map((municipio: any) => {
        return {
            label: municipio?.nome,
            value: municipio?.id
        }
    })
  
    function getSelectedMunicipio(id: number) {
      return optionsMunicipios.find((option: any) => option.value === id)
    }

  async function onSubmit(data: ComunicanteFormValues) {
    try {
      console.log(data)
      const output = await form.trigger(fields as FieldName[], {
        shouldFocus: true
      });
  
      if (!output) return;

      setLoading(true)
      const response = initialData?.id 
          ? await client.put(`/comunicante/${initialData?.id}`, data) 
          : await client.post('/comunicante', data)
      const { error, message } = response.data
      if (!error) {
        setLoading(false)
        toast.success(message)
        router.push('/dashboard/comunicante')
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
      const responseMunicipios = await client.get(`/estado/get-municipios/${form.getValues('endereco.estado_id')}`)
      const responseEstados = await client.get('/estado?orderBy=nome&order=asc')

      const { municipios } = responseMunicipios.data
      const { estados } = responseEstados.data
      setMunicipios(municipios);
      setEstados(estados);
    }
  }, [session, client, form])

  useEffect(() => {
    loadData()
  }, [loadData])

  // const { append, remove, fields } = useFieldArray({
  //     control,
  //     name: 'telefones'
  //   });

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
              <div className='flex flex-row col-span-4'>
              <FormField
                control={form.control}
                name="tipo_pessoa"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel className="block mb-2">
                    Tipo Pessoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup 
                      className="flex border border-gray-300 rounded-md px-4 items-center justify-center space-x-4"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center space-x-2">
                        <Input type="radio" id="tipoPessoa-F" value="F" checked={field.value === "F"} onChange={() => field.onChange("F")} />
                        <Label htmlFor="tipoPessoa-F">Física</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input type="radio" id="tipoPessoa-J" value="J" checked={field.value === "J"} onChange={() => field.onChange("J")} />
                        <Label htmlFor="tipoPessoa-J">Jurídica</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              </div>
              { tipoPessoa === 'F' ? (
                <>
                  <div className='col-span-2'>
                    <FormField
                      control={form.control}
                      name='pessoaFisica.nome'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder='Entre com o nome da unidade escolar' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='pessoaFisica.rg'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='pessoaFisica.cpf'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <div className='col-span-2'>
                    <FormField
                      control={form.control}
                      name='pessoaJuridica.nome_fantasia'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder='Entre com o nome da unidade escolar' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='pessoaJuridica.razao_social'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='pessoaJuridica.inscricao_estadual'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='pessoaJuridica.inscricao_federal'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Federal</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='telefone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
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
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                  <div className='mb-4 col-span-2'>
                    <FormField
                      control={form.control}
                      name="hasEnderecoData"
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
                              { initialData?.pessoa.endereco_id ? 'Editar Endereço' : 'Cadastrar Endereço' }
                            </FormLabel>
                            <FormDescription>
                              Permite cadastrar um endereço para o diretor
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-2 md:col-span-3'><Separator /></div>
              { hasEnderecoData && (
                <>
                  <div className='col-span-4'>
                    <span className='text-md'>Endereço</span>
                    <Separator />
                  </div>
                  <FormField
                    control={form.control}
                    name='endereco.cep'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='col-span-2'>
                    <FormField
                      control={form.control}
                      name='endereco.logradouro'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logradouro</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder=''
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                    <FormField
                      control={form.control}
                      name='endereco.numero'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                    name='endereco.complemento'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name='endereco.bairro'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <FormField
                    control={form.control}
                    name='endereco.estado_id'
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
                            {optionsEstados?.map((estado: OptionType) => (
                              <SelectItem key={estado.value?.toString()!} value={estado.value?.toString()!}>
                                {estado.label}
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
                    name='endereco.municipio_id'
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Município</FormLabel>
                        <SelectSearchable 
                          callback={(e) => { form.setValue('endereco.municipio_id', e.value) }} 
                          options={optionsMunicipios} 
                          field={getSelectedMunicipio(field.value)} 
                          placeholder="Selecione um Município..."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>  
              ) }
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
