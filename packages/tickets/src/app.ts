import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, currentUser } from '@dc-tickets/common'

import { indexRouter } from './routes/index'
import { newRouter } from './routes/new'
import { showRouter } from './routes/show'
import { updateRouter } from './routes/update'

export const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }))
app.use(currentUser)
app.use(indexRouter)
app.use(newRouter)
app.use(showRouter)
app.use(updateRouter)
app.use(errorHandler)
