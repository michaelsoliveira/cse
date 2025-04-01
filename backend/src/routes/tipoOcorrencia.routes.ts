import { TipoOcorrenciaController } from "../controllers/TipoOcorrenciaController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Unidades Escolares
routes.get('/', Authentication(), new TipoOcorrenciaController().findAll)
routes.get('/:id', Authentication(), new TipoOcorrenciaController().findOne)
routes.post('/', Authentication(), new TipoOcorrenciaController().store)
routes.put('/:id', Authentication(), new TipoOcorrenciaController().update)
routes.delete('/:id', Authentication(), new TipoOcorrenciaController().delete)

export default routes