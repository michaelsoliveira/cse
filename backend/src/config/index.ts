import { config } from 'dotenv';
const dotenv = require('dotenv')

dotenv.config()

const envfile = `.env.${process.env.ENVIRONMENT}`;
const envdir = process.cwd();

config({ path: `${envdir}/${envfile}` });

export const server = {
    clientId: '80208103401-2is5sf9cdimhq4ghphnn75aa4p1b4p20.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04Fc89XdM-PzrCgYIARAAGAQSNwF-L9Irg0ikVNVdyHDGaMH8jiOYv7XA3fjApuSxsDGJo7TD1cQ9ZeIcsN8Ud8ISQEq1TdEzhug',
    mailgunDomain: 'sandbox204307b6b2814f0d8b7d4e42828c3843.mailgun.org',
    mailgunAPIKey: 'b94381afdab6b5ed3b027513665a7480-2175ccc2-c1bae1f2',
    port: process.env.PORT,
    env: process.env.ENVIRONMENT,
    JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
    JWT_REFRESH: process.env.REFRESH_TOKEN_SECRET,
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
};

// dados de conexão com o banco
export const dbConnections = {
  postgres: {
    name: 'postgres',
    conn: String(process.env.DATABASE_CON),
  },
};

export default server