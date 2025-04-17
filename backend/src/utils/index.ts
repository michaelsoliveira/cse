import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function OrderByTerm(path: string, value: string) {
    const orderByElement: Array<string> = path ? path?.split('.') : []
    const orderByTerm = orderByElement?.length > 0 
        ? orderByElement?.reverse().reduce((acc: any, key) => ({ [key]: acc }), value) 
        : {}
    
    return orderByTerm
}

type Order = 'asc' | 'desc';

/**
 * Constrói um array de objetos `orderBy` no formato aceito pelo Prisma,
 * a partir de strings separadas por vírgula.
 *
 * @param orderByStr - Ex: "pessoa.pessoaJuridica.nome_fantasia,mes"
 * @param orderStr - Ex: "asc,desc"
 * @returns Array de objetos `orderBy` para uso com Prisma
 */
export function buildOrderBy(
  orderByStr?: string,
  orderStr?: string
): Record<string, any>[] {
  if (!orderByStr || !orderStr) return [];

  const fields = orderByStr.split(',').map((s) => s.trim());
  const directions = orderStr.split(',').map((s) =>
    s.trim().toLowerCase() as Order
  );

  return fields.map((field, index) => {
    const dir = directions[index] || 'asc';
    const parts = field.split('.');

    // Start with `dir`, but cast result to object explicitly
    const orderObj = parts.reduceRight<Record<string, any>>(
      (acc, key) => ({ [key]: acc }),
      dir as unknown as Record<string, any>
    );

    return orderObj;
  });
}
