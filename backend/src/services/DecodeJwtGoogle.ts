const { OAuth2Client } = require('google-auth-library')

export const getDecodedOAuthJwtGoogle = async (token: string | undefined) => {

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
    
    const tokenInfo = await client.getTokenInfo(token);

    return tokenInfo
  } catch (error: any) {
    return { status: 500, data: error }
  }
}