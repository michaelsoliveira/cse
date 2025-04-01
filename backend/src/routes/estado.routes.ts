import { EstadoController } from "../controllers/EstadoController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Estado
routes.post('/', Authentication(), new EstadoController().store)
routes.get('/', Authentication(), new EstadoController().findAll)
routes.get('/:id', Authentication(), new EstadoController().findOne)
routes.get('/search/q', Authentication(), new EstadoController().search)
routes.put('/:id', Authentication(), new EstadoController().update)
routes.delete('/single/:id', Authentication(), new EstadoController().delete)
routes.get('/get-municipios/:estado_id', Authentication(), new EstadoController().getMunicipios)

export default routes