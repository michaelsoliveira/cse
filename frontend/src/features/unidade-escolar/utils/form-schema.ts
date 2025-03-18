import * as z from 'zod';

const diretorDataSchema = z.discriminatedUnion("hasDiretorData", [
  z.object({
    hasDiretorData: z.literal(true),
    diretor: z.object({
      nome: z.string().min(3, { message: 'O nome do diretor deve conter no mínimo 3 caracteres' }),
      email: z.string().email({ message: 'O email informado está inválido'})
    })
  }),
  z.object({
    hasDiretorData: z.literal(false),
    id_diretor: z.string(),
  })
]);

export const unidadeSchema = z.object({
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
    endereco: z.object({
      logradouro: z.string().min(1, { message: 'O campo logradouro é obrigatório' }).optional(),
      numero: z.string().optional(),
      complemento: z.string(),
      // .min(3, { message: 'O campo complemento deve conter no mínimo 3 caracteres' }),
      bairro: z.string().min(1, { message: 'O campo logradouro é obrigatório' }).optional(),
      municipio: z.string().min(1, { message: 'O campo logradouro é obrigatório' }).optional(),
      estado: z.string().min(2, { message: 'O campo estado é obrigatório' }),
      cep: z.string().optional()
    }),
    telefones: z.array(
      z.object({
        ddd: z.number()
        .min(2)
        .max(2)
        .positive()
        .nullable()
        .transform((value: any) => value ?? NaN),
        numero: z.string()
        .nullable()
        // .transform((value: any) => value ?? NaN)
        // startdate: z
        //   .string()
        //   .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        //     message: 'Start date should be in the format YYYY-MM-DD'
        //   }),
        // enddate: z
        // .string()
        // .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        //   message: 'End date should be in the format YYYY-MM-DD'
        // })
      })
    )
}).and(diretorDataSchema);

export type UnidadeFormValues = z.infer<typeof unidadeSchema>;
