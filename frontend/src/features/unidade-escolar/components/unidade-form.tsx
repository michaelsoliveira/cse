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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldErrors, SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { DiretorType, UnidadeEscolarType } from 'types';
import { UnidadeFormValues, unidadeSchema } from '../utils/form-schema';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription } from '@/components/ui/form';

export default function ProductForm({
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
  // const [unidade, setUnidade] = useState<UnidadeEscolarType | null>(null);
  const [diretores, setDiretores] = useState<DiretorType[]>([]);
  const [estados, setEstados] = useState([])
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadData = useCallback(async () => {
    if (typeof session !== typeof undefined) {
      const responseDiretores = await client.get('/diretor')
      const responseEstados = await client.get('/estado')

      // Promise.all([responseDiretores, responseEstados]).then((res) => {
      //   console.log(res)
      // })
      const { diretores } = responseDiretores.data
      const { estados } = responseEstados.data
      setDiretores(diretores);
      setEstados(estados);
    }
  }, [session, client])

  useEffect(() => {
    loadData()
  }, [loadData])
  
  function getDiretoresOptions() : OptionType[] {
      return diretores?.map((diretor: any) => {
          return {
              label: diretor?.pessoa?.nome,
              value: diretor?.id
          }
      })
  }

  function getSelectedDiretor(id: string) {
    return getDiretoresOptions().find((option) => option.value === id)
  }

  function getEstadosOptions() : OptionType[] {
    return estados?.map((estado: any) => {
        return {
            label: estado?.uf,
            value: estado?.id
        }
    })
}

function getSelectedEstado(estado: string | null) {
  return getEstadosOptions().find((option) => option.value === estado)
}

const defaultValues = {
    nome: initialData?.nome || '',
    id_pessoa: initialData?.id_pessoa || '',
    id_diretor: initialData?.id_diretor || '',
    hasDiretorData: false,
    endereco: {
      logradouro: initialData?.endereco?.logradouro || '',
      numero: initialData?.endereco?.numero || '',
      complemento: initialData?.endereco?.complemento || '',
      bairro: initialData?.endereco?.bairro || '',
      municipio: initialData?.endereco?.municipio || '',
      estado: initialData?.endereco?.estado || '',
      cep: initialData?.endereco?.cep || ''
    },
    telefones: []
  }

  const form = useForm<UnidadeFormValues>({
    resolver: zodResolver(unidadeSchema),
    defaultValues,
    mode: 'all'
  });

  const {
    control,
    formState: { errors }
  } = form;

  const fullErrors: FieldErrors<Extract<UnidadeFormValues, { hasDiretorData: true}>> = errors

  type FieldName = keyof UnidadeFormValues;

  async function onSubmit(data: UnidadeFormValues) {
    await client.post('/unidade', data).then((res: any) => {
      const { error, message } = res.data
      if (!error) {
        toast.success(message)
        router.push('/dashboard/unidade-escolar')
      }
    }).catch((error: any) => {
      toast.error(error?.message)
    })
  }

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const hasDiretorData = useWatch({ control, name: 'hasDiretorData' })

  const { append, remove, fields } = useFieldArray({
      control,
      name: 'telefones'
    });

  const steps = [
    {
      id: 'Step 1',
      name: 'Informações Básicas',
      fields: ['nome', 'endereco.logradouro', 'endereco.complemento', 'endereco.bairro', 'endereco.municipio', 'endereco.estado', 'endereco.cep']
    },
    {
      id: 'Step 2',
      name: 'Informações da Direção',
      // fields are mapping and flattening for the error to be trigger  for the dynamic fields
      fields: ['diretor.nome', 'diretor.email']
    },
    {
      id: 'Step 3',
      name: 'Contatos',
      // fields are mapping and flattening for the error to be trigger  for the dynamic fields
      fields: fields
        ?.map((_: any, index: number) => [
          `telefones.${index}.ddd`,
          `telefones.${index}.numero`,
          // Add other field names as needed
        ])
        .flat()
    },
    { id: 'Step 4', name: 'Complete' }
  ];

  const processForm: SubmitHandler<UnidadeFormValues> = (data: any) => {
      console.log('data ==>', data);
      // setData(data);
      // api call and reset
      // form.reset();
    };

  return (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div
              className={cn(
                currentStep === 1
                  ? 'w-full md:inline-block'
                  : 'gap-8 md:grid md:grid-cols-3',
                  'pt-4'
              )}
            >
            {currentStep === 0 && (
              <>
            {/* <div className='grid grid-cols-1 gap-6 md:grid-cols-2'> */}
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
              <FormField
                control={form.control}
                name='endereco.municipio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Município</FormLabel>
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
                name='endereco.cep'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className='w-48'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endereco.estado'
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>UF</FormLabel>
                    <SelectSearchable 
                      callback={(e) => { form.setValue('endereco.estado', e.value) }} 
                      options={getEstadosOptions()} 
                      field={getSelectedEstado(field.value)} 
                      placeholder="Estado"
                      selectStyle="w-[150px]"
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
                  <div className='mb-4'>
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
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Cadastrar um Diretor
                            </FormLabel>
                            <FormDescription>
                              Permite vincular ou cadastrar o diretor da unidade escolar neste mesmo formulário
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-2'></div>
                {!hasDiretorData ? (
                  <>
                    <FormField
                      control={form.control}
                      name='id_diretor'
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Diretor</FormLabel>
                          <SelectSearchable 
                            callback={(e) => { form.setValue('id_diretor', e.value) }} 
                            options={getDiretoresOptions()} 
                            field={getSelectedDiretor(field.value)} 
                            placeholder="Selecione um Diretor..."
                            selectStyle="w-[450px]"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>

                ): (
                  <>
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
                  </>
                )}
                </div>
                </>
              )}
            </div>
            {(currentStep === steps.length - 1) && (
                <Button onClick={form.handleSubmit(processForm)} className="mt-4">Salvar</Button>
            )}
          </form>
        </Form>
        {/* Navigation */}
          <div className='mt-8 pt-5'>
            <div className='flex justify-between'>
              <button
                type='button'
                onClick={prev}
                disabled={currentStep === 0}
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
  );
}
