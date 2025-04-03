import * as z from 'zod';

export const tipoOcorrenciaSchema = z.object({
  nome: z.string()
    .nonempty('O nome do tipo da ocorrência é obrigatório')
    .min(5, { message: 'O campo nome do nome do tipo de ocorrência deve conter pelo menos 5 caracteres'}),

});

export type TipoOcorrenciaFormValues = z.infer<typeof tipoOcorrenciaSchema>;
