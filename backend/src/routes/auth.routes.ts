import { AuthController } from "../controllers/AuthController";
import { Authentication } from "../middleware/auth.middleware";

const express = require('express')
const routes = express.Router()

routes.post('/login', new AuthController().login)
routes.get('/oauth', new AuthController().googleAuth)
routes.get('/google', new AuthController().googleAuth)
routes.get('/me', Authentication(), new AuthController().getUserByToken)
routes.post('/refresh', new AuthController().refreshToken)
routes.get('/callback/github', new AuthController().signInCallback)

export default routes