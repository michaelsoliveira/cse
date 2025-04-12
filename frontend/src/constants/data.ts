import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Cadastro',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'settings',
    isActive: true,

    items: [
      
      {
        title: 'Unidade Escolar',
        url: '/dashboard/unidade-escolar',
        icon: 'userPen',
      },
      {
        title: 'Estado de Conservação',
        url: '/dashboard/estado-conservacao',
        icon: 'laptop'
      },
      {
        title: 'Diretor',
        url: '/dashboard/diretor',
        icon: 'user',
      },
    ]
  },
  {
    title: 'Ocorrência',
    url: '/dashboard/ocorrencia',
    icon: 'ellipsis'
  },
  {
    title: 'Tipo Ocorrência',
    url: '/dashboard/tipo-ocorrencia'
  },
  {
    title: 'Comunicante',
    url: '/dashboard/comunicante',
    icon: 'userPen',
    isActive: false,
  },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];