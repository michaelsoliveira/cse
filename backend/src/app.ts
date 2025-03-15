require('dotenv').config({ path: `${__dirname}/../.env.io` })
import { Request, Response, NextFunction } from "express"
const express = require('express');
import routes from "./routes"
import cors from 'cors'
import { Server } from 'socket.io'

const app = express()
const cookieParser = require('cookie-parser')

import { errorMiddleware } from "./middleware/error"

console.log('Version: ' + process.env.IO_VERSION)
console.log('Stage: ' + process.env.IO_STAGE)

var whitelist = [
  "http://localhost:3000", 
  "http://200.129.254.39:49157", 
  "http://io.cnpgc.embrapa.br:49157", 
  "https://bomanejo-app.a.cnpgc.embrapa.br", 
  "https://bomanejo-ml.alpha.agro.rocks", 
  "http://localhost:8501",
  "https://bomanejo.online", 
  "https://bomanejo.online/backend", 
  "https://bomanejo.online/kc", 
  "https://bomanejo.online/ml", 
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
app.use(routes)
app.use(errorMiddleware)

const server = app.listen(3333, () => {
    console.log("Now running on Port 3333")
})

const io = new Server(server, {
  cors: {
    origin: ['https://bomanejo-app.a.cnpgc.embrapa.br', 'https://bomanejo-ml.alpha.agro.rocks', 'http://localhost:3000', 'https://bomanejo.online', 'https://bomanejo.online/ml', 'https://bomanejo.online/backend']
  }
})


io.on('connection', (socket: any) => {
  global.Socket = socket

  const createdMessage = (msg: any) => {
    io.emit('access_token', msg);
  };

  socket.on("send_access_token", createdMessage);

  socket.on("disconnect", async () => {
    socket.disconnect()
  })
})