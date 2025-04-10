import 'express-async-errors'

import { Request, Response } from "express";
// Importando as rotas
import authRoutes from "./auth.routes";
import comunicanteRoutes from "./comunicante.routes";
import dashboardRoutes from "./dashboard.routes";
import diretorRoutes from "./diretor.routes";
import estadoRoutes from "./estado.routes";
import ocorrenciaRoutes from "./ocorrencia.routes";
import parametroRoutes from "./parametro.routes";
import permissionRoutes from "./permission.routes";
import roleRoutes from "./role.routes";
import tipoOcorrenciaRoutes from "./tipoOcorrencia.routes";
import unidadeRoutes from "./unidade.routes";
import usersRoutes from "./users.routes";
import avaliacaoUnidadeRoutes from "./avaliacao.unidade.routes"

import * as express from 'express';
const routes = express.Router()

const rootRoute = routes.get('/', function(request: Request, response: Response){
    return response.status(200).json({
        app: process.env.APP_NAME,
        version: process.env.VERSION
    })
})

export {
    authRoutes,
    comunicanteRoutes,
    dashboardRoutes,
    diretorRoutes,
    estadoRoutes,
    ocorrenciaRoutes,
    parametroRoutes,
    permissionRoutes,
    roleRoutes,
    unidadeRoutes,
    tipoOcorrenciaRoutes,
    usersRoutes,
    avaliacaoUnidadeRoutes,
    rootRoute
};