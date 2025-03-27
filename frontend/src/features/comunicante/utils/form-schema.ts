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
      municipio_id: z.number({ required_error: 'O município é obrigratório' }).int(),
      estado_id: z.string().nonempty('O campo estado é obrigatório'),
      cep: optionalFieldMin({ field: "cep", min: 8 })
    })
  }),
  z.object({
    hasEnderecoData: z.literal(false)
  })
]);

const tipoPessoaSchema = z.discriminatedUnion("tipo_pessoa", [
  z.object({
    tipo_pessoa: z.literal('F'),
    pessoaFisica: z.object({
      nome: z.string()
      .nonempty('O nome do comunicante é obrigatório')
      .min(5, { message: 'O campo nome do comunicante deve conter pelo menos 5 caracteres'}),
      rg: optionalFieldMin({ field: "rg", min: 4 }),
      cpf: optionalFieldMin({ field: "cpf", min: 11 }),
    })
  }),
  z.object({
    tipo_pessoa: z.literal('J'),
    pessoaJuridica: z.object({
      nome_fantasia: z.string()
      .nonempty('O nome do comunicante é obrigatório')
      .min(5, { message: 'O campo nome do comunicante deve conter pelo menos 5 caracteres'}),
      razao_social: optionalFieldMin({ field: "razao_social", min: 5 }),
      inscricao_estadual: optionalFieldMin({ field: "inscricao_estadual", min: 5 }),
      inscricao_federal: optionalFieldMin({ field: "inscricao_federal", min: 11 })
    })
  }),
  z.object({
    tipo_pessoa: z.literal(undefined)
  })
]);

export const comunicanteSchema = z.object({
  telefone: optionalFieldMin({ field: "telefone", min: 3 }),
  email: optionalFieldMin({ field: "email", min: 5, type: "email" })
}).and(tipoPessoaSchema).and(enderecoDataSchema);

export type ComunicanteFormValues = z.infer<typeof comunicanteSchema>;
