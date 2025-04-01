import { Request, Response } from "express";
import { Authentication } from "../middleware/auth.middleware";
import { UserController } from "../controllers/UserController";

const express = require('express')
const routes = express.Router()

routes.get('/', Authentication(), new UserController().findAll)
routes.get('/provider/find-by-email', Authentication(), new UserController().findByEmail)
routes.get('/:projetoId/:userId', Authentication(), new UserController().findOne)
routes.post('/create', new UserController().store)
routes.put('/:id', Authentication(), new UserController().update)
routes.get('/search', Authentication(), new UserController().search)
routes.delete('/:id', Authentication(), new UserController().delete)
routes.post('/create-role', Authentication(), new UserController().createRole)
routes.post('/create-permission', Authentication(), new UserController().createPermission)
routes.post('/create-role-permission/:roleId', Authentication(), new UserController().createRolePermission)
routes.post('/create-acl/:userId', Authentication(), new UserController().createUserACL)
routes.post('/send-email', new UserController().sendMail)
routes.post('/change-password', Authentication(), new UserController().updatePassword)
routes.get('/provider/find', new UserController().findProvider)

export default routes