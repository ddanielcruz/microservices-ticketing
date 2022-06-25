import mongoose from 'mongoose'

import { app } from './app'

async function bootstrap() {
  for (const key of ['JWT_KEY', 'MONGO_URI']) {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined `)
    }
  }

  await mongoose.connect(process.env.MONGO_URI!)
  const { PORT = '3000' } = process.env
  app.listen(PORT, () => {
    console.log(`Tickets service is running on port ${PORT}`)
  })
}

bootstrap()
