"use strict";
exports.__esModule = true;
exports.dbConnections = exports.server = void 0;
var dotenv_1 = require("dotenv");
var dotenv = require('dotenv');
dotenv.config();
var envfile = ".env." + process.env.ENVIRONMENT;
var envdir = process.cwd();
dotenv_1.config({ path: envdir + "/" + envfile });
exports.server = {
    port: process.env.PORT,
    env: process.env.ENVIRONMENT,
    JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
    JWT_REFRESH: process.env.REFRESH_TOKEN_SECRET,
    jwtExpiration: 3600,
    jwtRefreshExpiration: 86400
};
// dados de conexão com o banco
exports.dbConnections = {
    postgres: {
        name: 'postgres',
        conn: String(process.env.DATABASE_CON)
    }
};
exports["default"] = exports.server;
