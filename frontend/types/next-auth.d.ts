import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    expires: string;
    user: {
      username: string;
      email: string;
      image: string;
    }
    accessToken?: string;
    refreshToken?: string;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
