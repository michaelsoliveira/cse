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
import { useAuthContext } from '@/context/AuthContext';
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
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DiretorType, UnidadeEscolarType } from 'types';
import * as z from 'zod';

// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp'
// ];

const formSchema = z.object({
  // image: z
  //   .any()
  //   .refine((files) => files?.length == 1, 'Image is required.')
  //   .refine(
  //     (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max file size is 5MB.`
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     '.jpg, .jpeg, .png and .webp files are accepted.'
  //   ),
  nome: z.string().min(2, {
    message: 'O campo nome deve conter pelo menos 2 caracteres'
  }),
  id_diretor: z.string(),
  // id_pessoa: z.string()
  // price: z.number(),
  // description: z.string().min(10, {
  //   message: 'Description must be at least 10 characters.'
  // })
});

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: UnidadeEscolarType | null;
  pageTitle: string;
}) {
  const { client } = useAuthContext();
  const { data: session } = useSession();
  // const [unidade, setUnidade] = useState<UnidadeEscolarType | null>(null);
  const [diretores, setDiretores] = useState<DiretorType[]>([]);

  const loadData = useCallback(async () => {
    if (typeof session !== typeof undefined) {

      // if (unidadeId && unidadeId !== 'new') {
      //   const data = await client.get(`/unidade/${unidadeId}`)
      //   console.log(data)
      // }

      const response = await client.get('/diretor')

      const { diretores } = response.data
      setDiretores(diretores);
    }
  }, [session, initialData, client])

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

  const defaultValues = {
    nome: initialData?.nome || '',
    id_pessoa: initialData?.id_pessoa || '',
    id_diretor: initialData?.id_diretor || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await client.post('/unidade', {
      data
    })
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Images</FormLabel>
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
            /> */}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
              
            {/* <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter product description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            </div>
            <Button type='submit' className="mt-4">Salvar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
