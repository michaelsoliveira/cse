import { Icons } from '@/components/icons';

export interface EnderecoType {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  municipio?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  estado_id: string;
  numero_endereco?: string | null;
}

export interface PessoaType {
  id: string;
  tipo: "F" | "J";
  telefone?: string;
  email?: string;
  endereco_id?: string | null;
  endereco?: EnderecoType;
  pessoaFisica?: PessoaFisicaType;
  pessoaJuridica?: PessoaJuridicaType;
}

export interface TelefoneType {
  ddd?: number | null;
  numero?: number | null;
}

export interface UnidadeEscolarType {
  id?: string
  created_at?: string | null;
  updated_at?: string | null;
  inep: number | null;
  zona: string;
  hasDiretorData: boolean;
  pessoa_id: string;
  diretor_id: string;
  pessoa?: PessoaType;
  diretor?: DiretorType;
}

export interface PessoaJuridicaType {
  id: string;
  created_at: string;
  updated_at: string;
  nome_fantasia: string;
  razao_social: string;
  inscricao_estadual: string | null;
  inscricao_federal: string | null;
  cnpj: string;
  data_constituicao?: string | null;
  pessoa_id: string;
}

export interface DiretorType {
  id: string;
  pessoa_id: string;
  nome: string;
  telefone: string;
  email: string;
  pessoa: PessoaType;
}

export interface PessoaFisicaType {
  id: string
  created_at: string
  updated_at: string
  nome: string
  rg: string
  cpf: string
  data_nascimento?: string | null
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
