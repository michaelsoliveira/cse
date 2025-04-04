import { DashboardController } from "../controllers/DashboardController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

routes.get('/totals', Authentication(), new DashboardController().getDashboardTotals)
routes.get('/ocorrencias-unidades', Authentication(), new DashboardController().getOcorrenciasUnidades)
routes.get('/ocorrencia-tipos-totais', Authentication(), new DashboardController().getOcorrenciaTiposTotais)
routes.get('/ocorrencia-anual', Authentication(), new DashboardController().getOcorrenciaAnual)

export default routes