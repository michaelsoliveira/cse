import 'express-async-errors'
// import express, { Router } from "express"
import { Request, Response } from "express";
import { UserController } from "../controllers/UserController"
import { AuthController } from "../controllers/AuthController"
import { Authentication } from "../middleware/auth.middleware"
import { EstadoController } from "../controllers/EstadoController"
import { can, is } from "../middleware/permission"
import { RoleController } from "../controllers/RoleController"
import { PermissionController } from "../controllers/PermissionController"
import { UnidadeController } from '../controllers/UnidadeController';
import { DiretorController } from '../controllers/DiretorController';
import { OcorrenciaController } from '../controllers/OcorrenciaController';
import { ComunicanteController } from '../controllers/ComunicanteController';

const express = require('express')
const multer = require('multer')
const routes = express.Router()

routes.get('/', function(request: Request, response: Response){
    return response.status(200).json({
        projeto: process.env.IO_PROJECT,
        app: process.env.IO_APP,
        version: process.env.IO_VERSION
    })
})

routes.get('/status', function(request: Request, response: Response){
    return response.status(200).json()
})
routes.get('/users', Authentication(), new UserController().findAll)
routes.get('/users/provider/find-by-email', Authentication(), new UserController().findByEmail)
routes.get('/users/:projetoId/:userId', Authentication(), new UserController().findOne)
routes.post('/users/create', new UserController().store)
routes.put('/users/:id', Authentication(), new UserController().update)
routes.get('/users/search', Authentication(), new UserController().search)
routes.delete('/users/:id', Authentication(), new UserController().delete)
routes.post('/users/create-role', Authentication(), new UserController().createRole)
routes.post('/users/create-permission', Authentication(), new UserController().createPermission)
routes.post('/users/create-role-permission/:roleId', Authentication(), new UserController().createRolePermission)
routes.post('/users/create-acl/:userId', Authentication(), new UserController().createUserACL)
routes.post('/users/send-email', new UserController().sendMail)

//Alterar senha
routes.post('/users/change-password', Authentication(), new UserController().updatePassword)

routes.get('/provider/find', new UserController().findProvider)
routes.post('/auth/login', new AuthController().login)
routes.get('/auth/oauth', new AuthController().googleAuth)
routes.get('/auth/google', new AuthController().googleAuth)
routes.get('/auth/me', Authentication(), new AuthController().getUserByToken)
routes.post('/auth/refresh', new AuthController().refreshToken)
routes.get('/auth/callback/github', new AuthController().signInCallback)

//Estado
routes.post('/estado/', Authentication(), new EstadoController().store)
routes.get('/estado/', Authentication(), new EstadoController().findAll)
routes.get('/estado/:id', Authentication(), new EstadoController().findOne)
routes.get('/estado/search/q', Authentication(), new EstadoController().search)
routes.put('/estado/:id', Authentication(), new EstadoController().update)
routes.delete('/estado/single/:id', Authentication(), new EstadoController().delete)
routes.get('/estado/get-municipios/:estado_id', Authentication(), new EstadoController().getMunicipios)

//Role
routes.post('/role/', Authentication(), new RoleController().store)
routes.get('/role', new RoleController().findAll)
routes.get('/role/search', Authentication(), new RoleController().search)
routes.get('/role/:id', Authentication(), new RoleController().findOne)
routes.put('/role/:id', Authentication(), new RoleController().update)
routes.delete('/role/single/:id', Authentication(), new RoleController().delete)
routes.delete('/role/multiples', Authentication(), new RoleController().deleteAll)

//Permission
routes.post('/permission/', Authentication(), new PermissionController().store)
routes.get('/permission/', Authentication(), new PermissionController().findAll)
routes.get('/permission/:id', Authentication(), new PermissionController().findOne)
routes.get('/permission/search/q', Authentication(), new PermissionController().search)
routes.put('/permission/:id', Authentication(), new PermissionController().update)
routes.delete('/permission/single/:id', Authentication(), new PermissionController().delete)
routes.delete('/permission/multiples', Authentication(), new PermissionController().deleteAll)

//Unidades Escolares
routes.get('/unidade/', Authentication(), new UnidadeController().findAll)
routes.get('/unidade/:id', Authentication(), new UnidadeController().findOne)
routes.get('/unidade/search/q', Authentication(), new UnidadeController().search)
routes.post('/unidade', Authentication(), new UnidadeController().store)
routes.put('/unidade/:id', Authentication(), new UnidadeController().update)
routes.delete('/unidade/:id', Authentication(), new UnidadeController().delete)

//Unidades Escolares
routes.get('/diretor/', Authentication(), new DiretorController().findAll)
routes.get('/diretor/:id', Authentication(), new DiretorController().findOne)
routes.get('/diretor/search/q', Authentication(), new DiretorController().search)
routes.post('/diretor', Authentication(), new DiretorController().store)
routes.put('/diretor/:id', Authentication(), new DiretorController().update)
routes.delete('/diretor/:id', Authentication(), new DiretorController().delete)

//Ocorrencias
routes.get('/ocorrencia/', Authentication(), new OcorrenciaController().findAll)
routes.get('/ocorrencia/get-tipos', Authentication(), new OcorrenciaController().getTiposOcorrencia)
routes.get('/ocorrencia/get-lastest', Authentication(), new OcorrenciaController().getLastOcorrencias)
routes.get('/ocorrencia/:id', Authentication(), new OcorrenciaController().findOne)
routes.post('/ocorrencia', Authentication(), new OcorrenciaController().store)
routes.put('/ocorrencia/:id', Authentication(), new OcorrenciaController().update)
routes.delete('/ocorrencia/:id', Authentication(), new OcorrenciaController().delete)

//Comunicantes
routes.get('/comunicante/', Authentication(), new ComunicanteController().findAll)
routes.get('/comunicante/:id', Authentication(), new ComunicanteController().findOne)
routes.post('/comunicante', Authentication(), new ComunicanteController().store)
routes.put('/comunicante/:id', Authentication(), new ComunicanteController().update)
routes.delete('/comunicante/:id', Authentication(), new ComunicanteController().delete)

export default routes;