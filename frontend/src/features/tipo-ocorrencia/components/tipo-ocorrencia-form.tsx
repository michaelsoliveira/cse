'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TipoOcorrenciaType } from 'types';
import { TipoOcorrenciaFormValues, tipoOcorrenciaSchema } from '../utils/form-schema';

export default function TipoOcorrenciaForm({
  initialData,
  pageTitle
}: {
  initialData: TipoOcorrenciaType | null;
  pageTitle: string;
}) {
  const { client } = useAuthContext();
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

const defaultValues = {
    nome: initialData?.nome || ''
  }

  const form = useForm<TipoOcorrenciaFormValues>({
    resolver: zodResolver(tipoOcorrenciaSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    // formState: { errors }
  } = form;

  // const fullErrors: FieldErrors<Extract<DiretorFormValues, { hasDiretorData: true}>> = errors

  type FieldName = keyof TipoOcorrenciaFormValues;

  const fields = ['nome']
  
  async function onSubmit(data: TipoOcorrenciaFormValues) {
    try {

      const output = await form.trigger(fields as FieldName[], {
        shouldFocus: true
      });
  
      if (!output) return;

      setLoading(true)
      const response = initialData?.id 
          ? await client.put(`/tipo-ocorrencia/${initialData?.id}`, data) 
          : await client.post('/tipo-ocorrencia', data)
      const { error, message } = response.data
      if (!error) {
        setLoading(false)
        toast.success(message)
        router.push('/dashboard/tipo-ocorrencia')
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <div
              className='gap-4 md:grid md:grid-cols-4 mt-4'
            >
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
