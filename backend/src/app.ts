require('dotenv').config({ path: `${__dirname}/../.env.io` })
// import { Request, Response, NextFunction } from "express"
const express = require('express');
import { 
    authRoutes,
    comunicanteRoutes,
    dashboardRoutes,
    diretorRoutes,
    estadoRoutes,
    ocorrenciaRoutes,
    permissionRoutes,
    roleRoutes,
    unidadeRoutes,
    usersRoutes,
    rootRoute
  } from "./routes"
import cors from 'cors'
import { Server } from 'socket.io'

const app = express()
const cookieParser = require('cookie-parser')

import { errorMiddleware } from "./middleware/error"
import { Request, Response } from "express";

console.log('Version: ' + process.env.IO_VERSION)
console.log('Stage: ' + process.env.IO_STAGE)

var whitelist = [
  "http://localhost:3000", 
  "http://172.18.0.2:3000", 
  "http://frontend-app-1", 
  "http://frontend-nginx-1",
  "http://172.18.0.3",
  "http://cse.seed.ap.br",
  "http://localhost"
]
var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
// app.use(express.urlencoded({limit: '50mb'}));
app.use(cors(corsOptions))
app.use('/backend', rootRoute)
app.use('/backend/status', function(request: Request, response: Response) { return response.status(200).json() })
app.use('/backend/auth', authRoutes)
app.use('/backend/comunicante', comunicanteRoutes)
app.use('/backend/dashboard', dashboardRoutes)
app.use('/backend/diretor', diretorRoutes)
app.use('/backend/estado', estadoRoutes)
app.use('/backend/ocorrencia', ocorrenciaRoutes)
app.use('/backend/permission', permissionRoutes)
app.use('/backend/role', roleRoutes)
app.use('/backend/unidade', unidadeRoutes)
app.use('/backend/users', usersRoutes)

app.use(errorMiddleware)

const server = app.listen(3333, () => {
    console.log("Now running on Port 3333")
})

const io = new Server(server, {
  cors: {
    origin: ['https://bomanejo-app.a.cnpgc.embrapa.br', 'https://bomanejo-ml.alpha.agro.rocks', 'http://localhost:3000', 'https://bomanejo.online', 'https://bomanejo.online/ml', 'https://bomanejo.online/backend']
  }
})


io.on('connection', (socket) => {
  // global.Socket = socket

  const createdMessage = (msg: any) => {
    io.emit('access_token', msg);
  };

  socket.on("send_access_token", createdMessage);

  socket.on("disconnect", async () => {
    socket.disconnect()
  })
})