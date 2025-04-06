import { validate } from 'uuid';
import * as z from 'zod';


type optionFieldMinType = {
  field: string,
  min?: number | null,
  type?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

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

const anexoDataSchema = z.discriminatedUnion("hasAnexoData", [
  z.object({
    hasAnexoData: z.literal(true),
    anexo: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
  }),
  z.object({
    hasAnexoData: z.literal(false),
  })
])

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
  acionamento: z.string(),
  comunicante_id: z.string()
}).and(anexoDataSchema);

export type OcorrenciaFormValues = z.infer<typeof ocorrenciaSchema>;
