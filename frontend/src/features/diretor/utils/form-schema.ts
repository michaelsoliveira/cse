import { validate } from 'uuid';
import * as z from 'zod';


type optionFieldMinType = {
  field: string,
  min?: number | null,
  type?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalFieldMin = ({ field, min, type = "string" }: optionFieldMinType) => {
  switch(type) {
    case "string": 
      return z.string()
        .optional()
        .refine((val) => !val || val.length >= min!, {
          message: `O campo '${field}' deve ter ao menos ${min} caracteres, se preenchido.`,
        });
    case "number":
      return z.literal("").transform(() => undefined)
      .or(z.coerce.number());
      // .positive()
      // .nullable()
      // .transform((value: any) => value ?? NaN)
    case "email": 
      return z.string()
          .optional()
          .refine(
            (val) => !val || val.length >= min!, {
            message: `O campo '${field}' deve ter ao menos ${min} caracteres, se preenchido.`,
          }).refine((val: any) => !val || emailRegex.test(val), {
            message: "O email informado está inválido",
          })
    default:
      return z.string().optional()
        .refine((val) => !val || val.length >= min!, {
          message: `O campo '${field}' deve ter ao menos ${min} caracteres, se preenchido.`,
        })
  }
}

const diretorDataSchema = z.discriminatedUnion("hasDiretorData", [
  z.object({
    hasDiretorData: z.literal(true),
    diretor: z.object({
        nome: z.string()
        .nonempty('O nome do diretor é obrigatório')
        .min(5, {
          message: 'O campo nome do diretor deve conter pelo menos 5 caracteres'
      }),
      rg: optionalFieldMin({ field: "rg", min: 4 }),
      cpf: optionalFieldMin({ field: "cpf", min: 11 }),
      telefone: optionalFieldMin({ field: "telefone", min: 3 }),
      email: optionalFieldMin({ field: "email", min: 5, type: "email" })
    })
  }),
  z.object({
    hasDiretorData: z.literal(false),
    diretor_id: z.string().nonempty('É necessário selecionar ou cadastrar um diretor'),
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
    nome: z.string()
      .nonempty('O nome da unidade escolar é obrigatório')
      .min(5, {
        message: 'O campo nome deve conter pelo menos 2 caracteres'
    }),
    inep: optionalFieldMin({ field: "inep", type: "number" }),
    zona: z.string(),
    email: optionalFieldMin({ field: "email", min: 5, type: "email" }), 
    // z.string().email({ message: 'O email informado está inválido'}),
    telefone: optionalFieldMin({ field: "telefone", min: 3 }),
    endereco: z.object({
      logradouro: optionalFieldMin({ field: "logradaouro", min: 4 }),
      numero: z.string().optional(),
      complemento: optionalFieldMin({ field: "complemento", min: 4 }),
      // .min(3, { message: 'O campo complemento deve conter no mínimo 3 caracteres' }),
      bairro: optionalFieldMin({ field: "bairro", min: 3 }),
      municipio: optionalFieldMin({ field: "municipio", min: 3 }),
      estado_id: z.string(),
      cep: optionalFieldMin({ field: "cep", min: 8 }),
    }),
    // telefones: z.array(
    //   z.object({
    //     ddd: z.number()
    //     .min(2)
    //     .max(2)
    //     .positive()
    //     .nullable()
    //     .transform((value: any) => value ?? NaN),
    //     numero: z.string()
    //     .nullable()
    //     // .transform((value: any) => value ?? NaN)
    //     // startdate: z
    //     //   .string()
    //     //   .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    //     //     message: 'Start date should be in the format YYYY-MM-DD'
    //     //   }),
    //     // enddate: z
    //     // .string()
    //     // .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    //     //   message: 'End date should be in the format YYYY-MM-DD'
    //     // })
    //   })
    // )
}).and(diretorDataSchema);

export type UnidadeFormValues = z.infer<typeof unidadeSchema>;
