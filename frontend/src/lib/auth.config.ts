/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });


const authConfig = {
  providers: [
    GithubProvider({}),
    GoogleProvider({}),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { 'Content-Type': 'application/json' },
            }
          );

          const response = await res.json().then((data) => {
              const { error, message, user } = data
              if (!error) {
                return {
                  error,
                  local: true,
                  ...user,
                }
              }

              return {
                error,
                message,
                user
              }
            })
            .catch((res) => {
              return res;
            });
            // If no error and we have user data, return it
            if (res.ok && response) {
              return response;
            }
          return null;
        } catch (error) {
          const errorMessage = error;
          throw new Error(`${errorMessage}&email=${credentials?.email}`);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ user, session, token }: any) {
      if (user) {
        console.log(user, session)
        return {
          user: {
            id: user.id,
            email: user.email,
            username: user?.username,
            image: user.image,
            // roles: user.roles,
          },
          accessToken: user.access_token,
          accessTokenExpires: Date.now() + user.expires_in * 1000,
          refreshToken: user.refresh_token,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      } 

    }
    
  },
  pages: {
    signIn: '/login' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
