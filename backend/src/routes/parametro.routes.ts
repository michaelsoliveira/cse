import { ParametroController } from "../controllers/ParametroController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Estado
routes.post('/', Authentication(), new ParametroController().store)
routes.get('/', Authentication(), new ParametroController().findAll)
routes.get('/:id', Authentication(), new ParametroController().findOne)
routes.put('/:nome', Authentication(), new ParametroController().update)
routes.delete('/single/:id', Authentication(), new ParametroController().delete)

export default routes