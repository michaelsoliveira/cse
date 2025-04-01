import { ComunicanteController } from "../controllers/ComunicanteController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Comunicantes
routes.get('/', Authentication(), new ComunicanteController().findAll)
routes.get('/get-list', Authentication(), new ComunicanteController().getListNames)
routes.get('/:id', Authentication(), new ComunicanteController().findOne)
routes.post('/', Authentication(), new ComunicanteController().store)
routes.put('/:id', Authentication(), new ComunicanteController().update)
routes.delete('/:id', Authentication(), new ComunicanteController().delete)

export default routes