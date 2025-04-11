import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  zonas: parseAsString,
  categories: parseAsString,
  orderBy: parseAsString,
  order: parseAsString,
  dataInicio: parseAsString,
  dataFim: parseAsString,
  classificacao_ocorrencia: parseAsString,
  tipo_ocorrencia: parseAsString,
  unidade_id: parseAsString,
  ano: parseAsString,
  mes: parseAsString,
  status: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
