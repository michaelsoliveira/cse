import { DashboardControoler } from "../controllers/DashboardController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

routes.get('/totals', Authentication(), new DashboardControoler().getDashboardTotals)
routes.get('/ocorrencia-tipos-totais', Authentication(), new DashboardControoler().getOcorrenciaTiposTotais)
routes.get('/ocorrencia-anual', Authentication(), new DashboardControoler().getOcorrenciaAnual)

export default routes