import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

async function bootstrap() {
  for (const key of ['JWT_KEY', 'MONGO_URI']) {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined `)
    }
  }

  await mongoose.connect(process.env.MONGO_URI!)
  await natsWrapper.connect('ticketing', 'any-value', 'https://nats-srv:4222')
  natsWrapper.client.on('close', () => {
    console.log('Disconnecting from NATS client')
    return process.exit()
  })

  const { PORT = '3000' } = process.env
  app.listen(PORT, () => {
    console.log(`Tickets service is running on port ${PORT}`)
  })
}

bootstrap()

process.on('SIGINT', () => natsWrapper.disconnect())
process.on('SIGTERM', () => natsWrapper.disconnect())
