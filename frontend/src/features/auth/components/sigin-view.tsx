import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-black dark:border-r lg:flex'>
      <div className="absolute z-0 inset-0 h-full w-full items-center px-5 py-24 bg-gradient-to-b from-white via-white via-50% to-[#16A34A]" />
        <div className='flex flex-col items-center justify-center mx-24 space-x-2'>
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <Image 
              src="/images/logo.png" 
              width="200"
              height="200"
              style={{width:'300px', height: "auto" }}
              priority={true}
              alt={'Logo UNIFAP'} 
            />
          </div>
          <span className='text-lg text-center z-30 mt-4'>
            SECRETARIA DE ESTADO DA EDUCAÇÃO <br />
            COORDENADORIA DE SEGURANÇA ESCOLAR
          </span>
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Sistema de Gerenciamento para o projeto Escolar Segura do 
              Governo do Estado do Amapá.&rdquo;
            </p>
            <footer className='text-sm'>Michael Oliveira</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Coordenadoria de Segurança Escolar
            </h1>
            <p className='text-sm text-muted-foreground'>
              Entre com um email e senha para ter acesso ao sistema
            </p>
          </div>
          <UserAuthForm />
          <p className='px-8 text-center text-xs text-muted-foreground'>
            Ao clicar em entrar, você está de acordo com os nossos {' '}
            <Link
              href='/docs/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Termos de Serviço
            </Link>{' '}
            and{' '}
            <Link
              href='/docs/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
