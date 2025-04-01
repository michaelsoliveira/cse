import { DiretorController } from "../controllers/DiretorController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

//Unidades Escolares
routes.get('/', Authentication(), new DiretorController().findAll)
routes.get('/:id', Authentication(), new DiretorController().findOne)
routes.get('/search/q', Authentication(), new DiretorController().search)
routes.post('/', Authentication(), new DiretorController().store)
routes.put('/:id', Authentication(), new DiretorController().update)
routes.delete('/:id', Authentication(), new DiretorController().delete)

export default routes