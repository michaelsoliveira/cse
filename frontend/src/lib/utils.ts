import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from './auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchAPI = async (route: string, method?: string, data?: any) => {
  const session = await auth();
  const url = route.startsWith('/') ? route : '/' + route;
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: method || "GET",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": `Bearer ${session?.accessToken!}`
      },
      body: JSON.stringify(data)
  }).then((data) => data.json())

  return result
}

// Função para quebrar os rótulos do eixo Y em duas linhas
export const formatLabel = (label: string) => {
  const words = label.split(" ");
  if (words.length > 2) {
    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")]; // Divide após 2 palavras
  }
  return [label];
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
