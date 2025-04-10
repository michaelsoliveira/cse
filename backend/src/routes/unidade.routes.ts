import { UnidadeController } from "../controllers/UnidadeController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Unidades Escolares
routes.get('/', Authentication(), new UnidadeController().findAll)
routes.get('/:id', Authentication(), new UnidadeController().findOne)
routes.get('/search/q', Authentication(), new UnidadeController().search)
routes.post('/', Authentication(), new UnidadeController().store)
routes.put('/:id', Authentication(), new UnidadeController().update)
routes.delete('/:id', Authentication(), new UnidadeController().delete)

export default routes