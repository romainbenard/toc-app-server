import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import authRouter from './routers/auth.routes'
import usersRouter from './routers/user.routes'
import httpLogger from './lib/logger'
import validateEnv from './utils/validateEnv'
import errorMiddleware from './middlewares/error.middleware'

validateEnv()

const app = express()

app.use(httpLogger)
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use(errorMiddleware)

export default app
