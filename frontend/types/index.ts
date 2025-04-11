import { Icons } from '@/components/icons';
import { any, literal } from 'zod';

export interface EnderecoType {
  id: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  municipio_id: number;
  estado_id: number;
  complemento?: string;
  bairro?: string;
}

export interface AvaliacaoUnidadeType {
  id: string;
  unidade_id: string;
  ano: string;
  mes: string;
  status: string;
  obs?: string;
  unidade?: UnidadeEscolarType;
}

export interface OcorrenciaType {
  id: string;
  descricao?: string;
  data?: string;
  hora?: string;
  classificacao: string;
  acionamento: string;
  comunicante_id?: string;
  unidade_id: string;
  tipo_id: string;
  anexos: any;
  tipo_ocorrencia: TipoOcorrenciaType;
  unidade_escolar: UnidadeEscolarType;
}

export interface TipoOcorrenciaType {
  id: string;
  nome: string;
}

export interface EstadoType {
  id: number;
  nome: string;
  uf: string;
  ddd: Array<number>
}

export interface MunicipioType {
  id: number;
  nome: string;
  lat_lon: string;
  estado_id: number;
  estado: EstadoType;
}

export interface PessoaType {
  id?: string;
  tipo?: "F" | "J";
  telefone?: string;
  email?: string;
  endereco_id?: string;
  endereco?: EnderecoType;
  pessoaFisica?: PessoaFisicaType;
  pessoaJuridica?: PessoaJuridicaType;
}

export interface UnidadeEscolarType {
  id?: string
  inep?: number;
  zona?: string;
  hasDiretorData?: boolean;
  pessoa_id?: string;
  diretor_id?: string;
  pessoa?: PessoaType;
  diretor?: DiretorType;
}

export interface PessoaJuridicaType {
  id?: string;
  nome_fantasia: string;
  razao_social?: string;
  inscricao_estadual?: string;
  inscricao_federal?: string;
  cnpj?: string;
  data_constituicao?: string;
  pessoa_id?: string;
}

export interface TipoOcorrenciaType {
  id: string;
  nome: string;
}

export interface DiretorType {
  id: string;
  pessoa_id: string;
  nome: string;
  rg?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  pessoa: PessoaType;
}

export interface ComunicanteType {
  id: string;
  pessoa_id: string;
  telefone?: string;
  email?: string;
  pessoa: PessoaType;
}

export interface PessoaFisicaType {
  id: string
  nome: string
  rg: string
  cpf: string
  data_nascimento?: string
  pessoa_id: string
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
