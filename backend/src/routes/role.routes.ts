import { RoleController } from "../controllers/RoleController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Role
routes.post('/', Authentication(), new RoleController().store)
routes.get('/', new RoleController().findAll)
routes.get('/search', Authentication(), new RoleController().search)
routes.get('/:id', Authentication(), new RoleController().findOne)
routes.put('/:id', Authentication(), new RoleController().update)
routes.delete('/single/:id', Authentication(), new RoleController().delete)
routes.delete('/multiples', Authentication(), new RoleController().deleteAll)

export default routes