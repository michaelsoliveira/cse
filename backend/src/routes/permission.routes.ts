import { PermissionController } from "../controllers/PermissionController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Permission
routes.post('/', Authentication(), new PermissionController().store)
routes.get('/', Authentication(), new PermissionController().findAll)
routes.get('/:id', Authentication(), new PermissionController().findOne)
routes.get('/search/q', Authentication(), new PermissionController().search)
routes.put('/:id', Authentication(), new PermissionController().update)
routes.delete('/single/:id', Authentication(), new PermissionController().delete)
routes.delete('/multiples', Authentication(), new PermissionController().deleteAll)

export default routes