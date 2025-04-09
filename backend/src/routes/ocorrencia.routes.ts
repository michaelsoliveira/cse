import { OcorrenciaController } from "../controllers/OcorrenciaController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Ocorrencias
routes.get('/', Authentication(), new OcorrenciaController().findAll)
routes.post("/upload-url", new OcorrenciaController().getUploadUrl);
routes.get('/get-tipos', Authentication(), new OcorrenciaController().getTiposOcorrencia)
routes.get('/get-lastest', Authentication(), new OcorrenciaController().getLastOcorrencias)
routes.get('/:id', Authentication(), new OcorrenciaController().findOne)
routes.post('/', Authentication(), new OcorrenciaController().store)
routes.put('/:id', Authentication(), new OcorrenciaController().update)
routes.delete('/:id', Authentication(), new OcorrenciaController().delete)

export default routes