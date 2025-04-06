'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';
import GoogleSignInButton from './google-auth-button';
import { useAuthContext } from '@/context/AuthContext';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, informe em email válido' }),
  password: z.string().min(3, { message: "A senha deve conter no mínimo 3 caracteres" }),
  username: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl');
  const { client } = useAuthContext()

  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: '',
    password: '',
    username: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
        if (!register) {
          const response = await signIn("credentials", {
            email: data.email,
            password: data.password,
            // callbackUrl: callbackUrl ?? "/dashboard",
            // redirectTo: '/dashboard'
            redirect: false
          })
          // console.log(JSON.stringify(response))
          if (response?.error && response?.error === "CredentialsSignin") 
            {
              toast.success('Oops, Ocorreu um erro na autenticação', {
                description: "Por favor, verifique sua senha e tente novamente",
                action: {
                  label: 'Fechar',
                  onClick: () => true
                }
              });
              return
            }
  
            if (!response?.error) {
              toast.success('Login realizado com sucesso')
              router.push('/dashboard')
            }    
        } else {
          try {
            // Cadastra o usuário
            const registerResponse = await client.post('/users/create', data);
            const { error, message } = registerResponse.data;
    
            if (error) {
              toast.error('Erro ao cadastrar', {
                description: message || "Tente novamente",
              });
              return;
            }
    
            toast.success('Usuário cadastrado com sucesso');
    
            // Faz login automático após cadastro
            const loginResponse = await signIn("credentials", {
              email: data.email,
              password: data.password,
              redirect: false
            });
    
            if (!loginResponse?.error) {
              toast.success('Login realizado com sucesso');
              router.push('/dashboard');
            } else {
              toast.error('Cadastro ok, mas erro ao logar');
            }
    
          } catch (err: any) {
            toast.error('Erro inesperado', {
              description: err?.message || 'Tente novamente'
            });
          }
        }
      })
        
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          // action={credentialsAction}
          className='w-full space-y-2'
        >
          { register && (
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='pb-2'>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Entre com o nome'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='pb-2'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Entre com o email...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='pb-2'>
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder=''
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          { register ? (
            <>
              <Button disabled={loading} className='ml-auto w-full hover:cursor-pointer' type='submit'>
                Cadastrar
              </Button>
            </>
            ) : (
            <>
              <Button disabled={loading} className='ml-auto w-full hover:cursor-pointer' type='submit'>
                Entrar
              </Button>  
            </>
          ) }
        </form>
      </Form>
      <div className="flex items-center justify-between w-full lg:px-8">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Lembre-me
            </label>
          </div>

          <div className="text-sm">
            <a
              onClick={() => setRegister(!register)}
              href="#"
              className="font-medium text-custom-green hover:opacity-75"
            >
              { register ? "Já tem uma conta?" : "Não tem uma conta?" }
            </a>
          </div>
        </div>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue com
          </span>
        </div>
      </div>
      <GoogleSignInButton />
      <GithubSignInButton />
    </>
  );
}
