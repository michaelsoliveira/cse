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

const enderecoDataSchema = z.discriminatedUnion("hasEnderecoData", [
  z.object({
    hasEnderecoData: z.literal(true),
    endereco: z.object({
      logradouro: optionalFieldMin({ field: "logradaouro", min: 4 }),
      numero: z.string().optional(),
      complemento: optionalFieldMin({ field: "complemento", min: 4 }),
      bairro: optionalFieldMin({ field: "bairro", min: 3 }),
      municipio: optionalFieldMin({ field: "municipio", min: 3 }),
      estado_id: z.string(),
      cep: optionalFieldMin({ field: "cep", min: 8 })
    })
  }),
  z.object({
    hasEnderecoData: z.literal(false)
  })
]);

export const diretorSchema = z.object({
  nome: z.string()
    .nonempty('O nome do diretor é obrigatório')
    .min(5, { message: 'O campo nome do diretor deve conter pelo menos 5 caracteres'}),
  rg: optionalFieldMin({ field: "rg", min: 4 }),
  cpf: optionalFieldMin({ field: "cpf", min: 11 }),
  telefone: optionalFieldMin({ field: "telefone", min: 3 }),
  email: optionalFieldMin({ field: "email", min: 5, type: "email" })
}).and(enderecoDataSchema);

export type DiretorFormValues = z.infer<typeof diretorSchema>;
