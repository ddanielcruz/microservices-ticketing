import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listeners'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listeners'

async function bootstrap() {
  for (const key of ['JWT_KEY', 'MONGO_URI', 'NATS_URL', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID']) {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined `)
    }
  }

  const { MONGO_URI, NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID } = process.env
  await mongoose.connect(MONGO_URI!)
  await natsWrapper.connect(NATS_CLUSTER_ID!, NATS_CLIENT_ID!, NATS_URL!)
  natsWrapper.client.on('close', () => {
    console.log('Disconnecting from NATS client')
    return process.exit()
  })
  new TicketCreatedListener(natsWrapper.client).listen()
  new TicketUpdatedListener(natsWrapper.client).listen()

  const { PORT = '3000' } = process.env
  app.listen(PORT, () => {
    console.log(`Tickets service is running on port ${PORT}`)
  })
}

bootstrap()

process.on('SIGINT', () => natsWrapper.disconnect())
process.on('SIGTERM', () => natsWrapper.disconnect())
