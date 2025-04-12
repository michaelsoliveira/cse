export const meses = [
  { label: 'JANEIRO', value: 'jan' },
  { label: 'FEVEREIRO', value: 'fev' },
  { label: 'MARÇO', value: 'mar' },
  { label: 'ABRIL', value: 'abr' },
  { label: 'MAIO', value: 'mai' },
  { label: 'JUNHO', value: 'jun' },
  { label: 'JULHO', value: 'jul' },
  { label: 'AGOSTO', value: 'ago' },
  { label: 'SETEMBRO', value: 'set' },
  { label: 'OUTUBRO', value: 'out' },
  { label: 'NOVEMBRO', value: 'nov' },
  { label: 'DEZEMBRO', value: 'dez' },
] as const

export type AvaliacaoPorMes = {
  escola: string;
  municipio: string;
  avaliacoes: {
    [mes: string]: string;
  };
}

export type RawAvaliacao = {
  unidade?: {
    pessoa?: {
      endereco?: {
        municipio: {
          nome: string;
        }
      },
      pessoaJuridica?: {
        nome_fantasia?: string;
      };
    };
  };
  ano: string;
  mes: string;
  status: string;
};

export function agruparAvaliacoesPorEscola(data: any) {
  const resultado: AvaliacaoPorMes[] = [];

  data.forEach(({ escola, municipio, mes, status }: any) => {
    const entradaExistente = resultado.find(
      (e) => e.escola === escola && e.municipio === municipio
    );

    if (entradaExistente) {
      entradaExistente.avaliacoes[mes] = getStatus(status);
    } else {
      resultado.push({
        escola,
        municipio,
        avaliacoes: { [mes]: getStatus(status) }
      });
    }
  });

  return resultado;
}

export const statusOptions = [
  { label: 'MUITO BOM', value: 'muito_bom' },
  { label: 'BOM', value: 'bom' },
  { label: 'RUIM', value: 'ruim' },
  { label: 'SEM ACESSO', value: 'sem_acesso' },
] as const

type StatusValue = typeof statusOptions[number]['value'];

export function getStatus(value: string): string {
  const status = statusOptions.find(option => option.value === value);
  return status ? status.label : 'STATUS INVÁLIDO';
}

type MesValue = typeof meses[number]['value'];

export function getMes(value: string): string {
  const mes = meses.find(option => option.value === value);
  return mes ? mes.label : 'MÊS INVÁLIDO';
}