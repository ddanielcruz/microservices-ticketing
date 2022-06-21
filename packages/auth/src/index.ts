import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { errorHandler } from './middleware/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signOutRouter } from './routes/sign-out'
import { signUpRouter } from './routes/sign-up'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false, secure: true }))
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler)

async function bootstrap() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined ')
  }

  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
  const { PORT = '3000' } = process.env
  app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`)
  })
}

bootstrap()
