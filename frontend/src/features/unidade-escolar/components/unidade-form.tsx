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
  useForm, 
  useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { DiretorType, EstadoType, MunicipioType, UnidadeEscolarType } from 'types';
import { UnidadeFormValues, unidadeSchema } from '../utils/form-schema';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription } from '@/components/ui/form';
import UnidadeDetails from './unidade-details';
import LoadingModal from '@/components/loading-modal';
import { motion, AnimatePresence } from "framer-motion";

export default function UnidadeForm({
  initialData,
  pageTitle
}: {
  initialData: UnidadeEscolarType | null;
  pageTitle: string;
}) {
  const { client } = useAuthContext();
  const { data: session } = useSession();
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [diretores, setDiretores] = useState<DiretorType[]>([]);
  const [estados, setEstados] = useState<EstadoType[]>([])
  const [municipios, setMunicipios] = useState<MunicipioType[]>([])
  const [currentStep, setCurrentStep] = useState(0);

  const defaultValues = {
    nome: initialData?.pessoa?.pessoaJuridica?.nome_fantasia || '',
    inep: initialData?.inep || '',
    zona: initialData?.zona || 'urbana',
    telefone: initialData?.pessoa?.telefone || '',
    email: initialData?.pessoa?.email || '',
    pessoa_id: initialData?.pessoa_id || '',
    diretor_id: initialData?.diretor_id || '',
    diretor: {
      nome: initialData?.diretor?.pessoa?.pessoaFisica?.nome || '',
      rg: initialData?.diretor?.pessoa?.pessoaFisica?.rg || '',
      cpf: initialData?.diretor?.pessoa?.pessoaFisica?.cpf || '',
      telefone: initialData?.diretor?.pessoa?.telefone || '',
      email: initialData?.diretor?.pessoa?.email || '',
    },
    hasDiretorData: false,
    endereco: {
      logradouro: initialData?.pessoa?.endereco?.logradouro || '',
      numero: initialData?.pessoa?.endereco?.numero || '',
      complemento: initialData?.pessoa?.endereco?.complemento || '',
      bairro: initialData?.pessoa?.endereco?.bairro || '',
      municipio_id: initialData?.pessoa?.endereco?.municipio_id || 209,
      estado_id: initialData?.pessoa?.endereco?.estado_id || 4,
      cep: initialData?.pessoa?.endereco?.cep || ''
    }
  }

  const form = useForm<UnidadeFormValues>({
    resolver: zodResolver(unidadeSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    formState: { errors },
    getValues,
    setValue
  } = form;
  const formData = form.getValues()
  // const fullErrors: FieldErrors<Extract<UnidadeFormValues, { hasDiretorData: true}>> = errors

  type FieldName = keyof UnidadeFormValues;

  const loadData = useCallback(async () => {
    if (typeof session !== typeof undefined) {
      const fetchDiretores = client.get('/diretor')
      const fetchEstados = client.get('/estado?orderBy=nome&order=asc')
      
      await Promise.all([fetchDiretores, fetchEstados]).then(([resDiretores, restEstados]) => {
        setDiretores(resDiretores.data.diretores)
        setEstados(restEstados.data.estados)
      })
    }
  }, [session, client])

  const loadMunicipios = useCallback(async () => {
    const responseMunicipios = await client.get(`/estado/get-municipios/${form.getValues('endereco.estado_id')}`)
      const { municipios } = responseMunicipios.data
      setMunicipios(municipios)
  }, [client, form])

  useEffect(() => {
    loadData()
    loadMunicipios()
  }, [loadData, loadMunicipios])
  
  const optionsDiretores : OptionType[] = diretores?.map((diretor: any) => {
          return {
              label: diretor?.pessoa?.pessoaFisica?.nome,
              value: diretor?.id
          }
      })

  function getSelectedDiretor(id: string) {
    return optionsDiretores.find((option) => option.value === id)
  }

  const optionsMunicipios : OptionType[] = municipios?.map((municipio: any) => {
      return {
          label: municipio?.nome,
          value: municipio?.id
      }
  })

  function getSelectedMunicipio(id: number) {
    return optionsMunicipios.find((option: any) => option.value === id)
  }

  const optionsEstados : OptionType[] = estados?.map((estado: any) => {
      return {
          label: estado?.nome,
          value: estado?.id
      }
  })

  const selecMunicipio: MunicipioType | undefined = municipios.find((municipio: MunicipioType) => municipio.id === formData.endereco.municipio_id)
  const selecEstado: EstadoType | undefined = estados.find((estado: EstadoType) => estado.id === Number(formData.endereco.estado_id))
// function getSelectedEstado(estado_id: string | null) {
//   return optionsEstados?.find((option) => option.value === estado_id)
// }

  async function onSubmit(data: UnidadeFormValues) {
    try {
      setLoading(true)
      const response = initialData?.id 
          ? await client.put(`/unidade/${initialData?.id}`, data) 
          : await client.post('/unidade', data)
      const { error, message } = response.data
      if (!error) {
        toast.success(message, {
          duration: 2000
        })
        router.push('/dashboard/unidade-escolar')
        setLoading(false)
      } else {
        toast.error(message)
        setLoading(false)
      }
    } catch(error: any) {
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const hasDiretorData = useWatch({ control, name: 'hasDiretorData' })
  
  // const { append, remove, fields } = useFieldArray({
  //     control,
  //     name: 'telefones'
  //   });

  const steps = [
    {
      id: 'Etapa 1',
      name: 'Informações Básicas',
      fields: ['nome', 'email', 'telefone', 'endereco.logradouro', 'endereco.complemento', 'endereco.bairro', 'endereco.municipio_id', 'endereco.estado_id', 'endereco.cep']
    },
    {
      id: 'Etapa 2',
      name: 'Informações da Direção',
      // fields are mapping and flattening for the error to be trigger  for the dynamic fields
      fields: ['diretor_id', 'diretor.nome', 'diretor.rg', 'diretor.cpf', 'diretor.email', 'diretor.telefone']
    },
    // {
    //   id: 'Etapa 3',
    //   name: 'Contatos',
    //   // fields are mapping and flattening for the error to be trigger  for the dynamic fields
    //   fields: fields
    //     ?.map((_: any, index: number) => [
    //       `telefones.${index}.ddd`,
    //       `telefones.${index}.numero`,
    //       // Add other field names as needed
    //     ])
    //     .flat()
    // },
    { id: 'Etapa 3', name: 'Completo' }
  ];

  const getCep: any = async (cepField: string) => {
    const cep = cepField.replace(/\D/g, "")
    
    try {
      const data = await fetch(`https://viacep.com.br/ws/${cep}/json`).then((data) => data.json())
      
      const estado = estados.find((est: any) => est.uf == data.uf)
      const municipio = municipios.find((mun: any) => mun.nome == data.localidade)
      console.log(municipio)
      setValue("endereco.logradouro", data.logradouro)
      setValue("endereco.bairro", data.bairro)
      if (estado) {
        setValue("endereco.estado_id", estado?.id);
        loadMunicipios();
      }
      if (municipio) {
        setValue("endereco.municipio_id", municipio?.id)
      }
    } catch (error) {
      alert("Erro ao buscar o endereço.")
      console.error(error)
    }
  }

  return (
    <>
      <Card className='mx-auto w-full'>
        <CardHeader>
          <CardTitle className='text-left text-2xl font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            
              <ul className='flex gap-4'>
                {steps.map((step, index) => (
                  <li key={step.name} className='md:flex-1'>
                    {currentStep > index ? (
                      <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
                        <span className='text-sm font-medium text-sky-600 transition-colors'>
                          {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                      </div>
                    ) : currentStep === index ? (
                      <div
                        className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'
                        aria-current='step'
                      >
                        <span className='text-sm font-medium text-sky-600'>
                          {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                      </div>
                    ) : (
                      <div className='group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
                        <span className='text-sm font-medium text-gray-500 transition-colors'>
                          {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
              <div
                className={cn(
                  currentStep === 1
                    ? 'w-full md:inline-block'
                    : 'md:grid md:grid-cols-4',
                    'gap-2 mt-4'
                )}
              >
              {currentStep === 0 && (
                <>
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name='nome'
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
                  name='inep'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código INEP</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='Entre com o código INEP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='zona'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder='Selecione a Zona'
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* @ts-ignore  */}
                          {["urbana", "rural"].map((zona, idx) => (
                            <SelectItem key={idx} value={zona}>
                              {zona}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Institucional</FormLabel>
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
                      <FormLabel>Telefone Principal</FormLabel>
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
                          {...field}
                          disabled={loading}
                          onBlur={(e) => {
                            field.onBlur()
                            getCep(e.target.value)
                          }}
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
                  <div className='col-span-2'>
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
                </div>
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
                        onValueChange={(value) => {field.onChange(Number(value)); loadMunicipios()} }
                        value={String(field.value)}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder='Selecione um Estado'
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='overflow-y-auto max-h-[20rem]'>
                          {optionsEstados?.map((estado: any) => (
                            <SelectItem key={estado.value} value={estado.value.toString()}>
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
                )}
                {currentStep === 1 && (
                  <>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                    <div className='mb-4 col-span-2'>
                      <FormField
                        control={form.control}
                        name="hasDiretorData"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-2 leading-4">
                              <FormLabel>
                                {initialData?.id ? 'Editar Diretor' : 'Cadastrar Diretor'}
                              </FormLabel>
                              <FormDescription>
                                Permite vincular ou cadastrar o diretor da unidade escolar neste mesmo formulário
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='col-span-2 md:col-span-3'><Separator /></div>
                  {!hasDiretorData ? (
                    <>
                      <FormField
                        control={form.control}
                        name='diretor_id'
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Diretor</FormLabel>
                            <SelectSearchable 
                              callback={(e) => { form.setValue('diretor_id', e.value) }} 
                              options={optionsDiretores} 
                              field={getSelectedDiretor(field.value)} 
                              placeholder="Selecione um Diretor..."
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>

                  ): (
                    <>
                    <div className='col-span-2'>
                      <FormField
                        control={form.control}
                        name='diretor.nome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
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
                        name='diretor.rg'
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
                        name='diretor.cpf'
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
                      <FormField
                        control={form.control}
                        name='diretor.email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder='michaeloliveira@email.com'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='diretor.telefone'
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
                    </>
                  )}
                  </div>
                  </>
                )}
              </div>
              {currentStep === 2 && (
                <UnidadeDetails data={
                  { ...formData, endereco: { ...formData.endereco, estado: selecEstado, municipio: selecMunicipio } }
                } />
              ) }
                <div className='flex flex-row items-end justify-center'>
                  <Button 
                    type='submit'
                    className="mt-4 w-48"
                  >Salvar</Button>
                </div>
              </motion.div>
              </AnimatePresence>
            </form>
          </Form>
          {/* Navigation */}
            <div className='mt-8 pt-5'>
              <div className='flex justify-between'>
                <button
                  type='button'
                  onClick={() => {currentStep === 0 ? router.back() : prev() }}
                  // disabled={currentStep === 0}
                  className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 ring-1 shadow-xs ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                  <button
                    type='button'
                    onClick={next}
                    disabled={currentStep === steps.length - 1}
                    className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 ring-1 shadow-xs ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>
        </CardContent>
      </Card>
    <LoadingModal show={loading} />
  </>
  );
}
