import { auth } from '@/lib/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Nunito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coordenadoria de Segurança Escolar',
  description: 'Sistema de controle e acompanhamento da coordenadoria de segurança escolar'
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang='en' className={`${nunito.className}`} suppressHydrationWarning>
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
            <Providers session={session}>
              <AuthProvider>
                <Toaster />
                {children}
              </AuthProvider>
            </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
