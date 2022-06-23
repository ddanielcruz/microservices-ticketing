import mongoose from 'mongoose'

import { app } from './app'

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
