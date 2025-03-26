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
      .or(z.coerce.number().positive().transform((value: any) => value ?? NaN));
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

export const ocorrenciaSchema = z.object({
  unidade_id: z.string().nonempty('O campo unidade escolar é obrigatório'),
  tipo_id: z.string().nonempty('O campo tipo da ocorrência é obrigatório'),
  data: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'A data não está no formato válido DD/MM/YYYY'
    }),
  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Hora inválida. Use o formato HH:MM (24h)",
    }),
  descricao: optionalFieldMin({ field: "descricao", min: 5 }),
  classificacao: z.string(),
  comunicante_id: z.string()
});

export type OcorrenciaFormValues = z.infer<typeof ocorrenciaSchema>;
