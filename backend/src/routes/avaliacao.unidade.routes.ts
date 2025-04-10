import { AvaliacaoUnidadeController } from "../controllers/AvaliacaoUnidadeController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

routes.get('/', Authentication(), new AvaliacaoUnidadeController().findAll)
routes.get('/:id', Authentication(), new AvaliacaoUnidadeController().findOne)
routes.post('/', Authentication(), new AvaliacaoUnidadeController().store)
routes.put('/:id', Authentication(), new AvaliacaoUnidadeController().update)
routes.delete('/:id', Authentication(), new AvaliacaoUnidadeController().delete)

export default routes