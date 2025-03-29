import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google'
import userService from '@/services/user';

// const GOOGLE_AUTHORIZATION_URL =
//   'https://accounts.google.com/o/oauth2/v2/auth?' +
//   new URLSearchParams({
//     prompt: 'consent',
//     access_type: 'offline',
//     response_type: 'code',
//   });

async function findProvider(token: any) {
  const { name, email, provider, access_token } = token;

  try {
    const dataProvider = {
      username: name,
      email,
      password: Math.random().toString(36).slice(-8),
      image: token?.picture,
      provider,
      id_provider: token?.sub,
      by_provider: true,
    };

    const userExists = await userService.findProvider(token);

    if (userExists) {
      if (!userExists.provider || !userExists.id_provider)
        await userService.update(userExists?.id, dataProvider, access_token);
    } else {
      const user = await userService.create(dataProvider)
        .then(async (res: any) => {
          await userService.sendEmail(dataProvider)
          return res.data
        }).catch((error: any) => {
          console.log(error)
          return null
        })

        return user
    }
    return userExists;
  } catch (error: any) {
    console.log(error.message);
  }
}


async function refreshAccessToken(token: any) {
  const provider = token.provider ? token.provider : 'local';

  switch (provider) {
    case 'keycloak': {
      try {
        if (Date.now() > token.refreshTokenExpired) throw Error;
        const details = {
          client_id: process.env.KC_CLIENT_ID,
          client_secret: process.env.KC_CLIENT_SECRET,
          grant_type: ['refresh_token'],
          refresh_token: token.refreshToken,
        };
        const formBody: string[] = [];
        Object.entries(details).forEach(([key, value]: [string, any]) => {
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(value);
          formBody.push(encodedKey + '=' + encodedValue);
        });
        const formData = formBody.join('&');
        const url = `${process.env.KC_BASE_URL}/token`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formData,
        });
        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;
        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          accessTokenExpired:
            Date.now() + (refreshedTokens.expires_in - 15) * 1000,
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
          refreshTokenExpired:
            Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
        };
      } catch (error) {
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    }
    case 'local': {
      try {
        const refreshToken = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh?userId=${token.user?.id}`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: null
          }
        ).then((res) => res.json())
        
        const data = {
          ...token,
          accessToken: refreshToken?.access_token,
          accessTokenExpires: Date.now() + refreshToken?.expires_in * 1000,
          refreshToken: refreshToken?.refresh_token ?? token?.refreshToken,
        }
        
        return data
      } catch (error: any) {
        console.log(error);

        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    }

    case 'google': {
      try {
        const url =
          'https://oauth2.googleapis.com/token?' +
          new URLSearchParams({
            client_id:
              '80208103401-2is5sf9cdimhq4ghphnn75aa4p1b4p20.apps.googleusercontent.com',
            client_secret: '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',
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
          });

        const response = await fetch(url, {
          cache: 'no-store',
          body: null,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
          throw refreshedTokens;
        }

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
      } catch (error: any) {
        console.log(error);

        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    }

    default: {
      return token;
    }
  }
}
  
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
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ user, token, account }: any) {
      if (user?.local) {
        return {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image,
            roles: user.roles,
          },
          accessToken: user.access_token,
          accessTokenExpires: Date.now() + user.expires_in * 1000,
          refreshToken: user.refresh_token,
        };
      }
      if (account) {
        const dataUser = await findProvider({ ...token, ...account });
        return {
          provider: account.provider,
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user: {
            id: user?.id,
            email: user?.email,
            image: user?.image,
            username: user?.name,
            roles: user.roles
          },
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      } 
      
      return refreshAccessToken(token);

    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token.user;
      session.user.roles = token.user?.roles;
      session.provider = token.provider;
      session.id = token.id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresIn = token.accessTokenExpires;

      return session;
    },

  },
  pages: {
    signIn: '/login' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
