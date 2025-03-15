export const pessoa_type: {
    fisica: 'Física',
    juridica: 'Jurídica'
  };

  export interface UnidadeEscolarType {
    error: boolean
    unidades: Unidade[]
    skip: any
    count: number
    message: any
  }
  
  export interface UnidadeType {
    id: string
    created_at: string
    updated_at: string
    id_pessoa: string
    id_endereco: any
    id_diretor: string
    pessoa: Pessoa
    diretor: Diretor
  }
  
  export interface PessoaJuridicaType {
    id: string
    created_at: string
    updated_at: string
    nome_fantasia: string
    razao_social: string
    inscricao_estadual: any
    inscricao_federal: any
    cnpj: any
    data_constituicao: any
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
    data_nascimento: any
    id_pessoa: string
  }
  