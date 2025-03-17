import { Icons } from '@/components/icons';

export interface EnderecoType {
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  municipio?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export interface PessoaType {
  id: string;
  tipo: "F" | "J";
  id_endereco?: string | null;
  endereco?: EnderecoType;
}

export interface UnidadeEscolarType {
  id: string
  created_at?: string | null;
  updated_at?: string | null;
  nome: string;
  id_pessoa: string;
  id_diretor: string;
  pessoa: PessoaJuridicaType;
  diretor: DiretorType;
}

export interface PessoaJuridicaType {
  id: string
  created_at: string
  updated_at: string
  nome_fantasia: string
  razao_social: string
  inscricao_estadual: string | null
  inscricao_federal: string | null
  cnpj: string
  data_constituicao?: string | null
  id_pessoa: string
}

export interface DiretorType {
  id: string
  id_pessoa: string
  pessoa: PessoaFisicaType
}

export interface PessoaFisicaType {
  id: string
  created_at: string
  updated_at: string
  nome: string
  rg: string
  cpf: string
  data_nascimento?: string | null
  id_pessoa: string
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
