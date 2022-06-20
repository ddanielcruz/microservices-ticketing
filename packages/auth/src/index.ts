import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'

import { errorHandler } from './middleware/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signOutRouter } from './routes/sign-out'
import { signUpRouter } from './routes/sign-up'

const app = express()
app.use(express.json())
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler)

async function bootstrap() {
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
  const { PORT = '3000' } = process.env
  app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`)
  })
}

bootstrap()
