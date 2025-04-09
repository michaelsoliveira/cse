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