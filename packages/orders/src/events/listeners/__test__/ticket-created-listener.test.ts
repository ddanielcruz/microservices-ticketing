import { TicketCreatedEvent } from '@dc-tickets/common'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

import { TicketCreatedListener } from '../ticket-created-listeners'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    title: 'any-title',
    userId: new Types.ObjectId().toHexString()
  }
  const msg: Message = { ack: jest.fn() } as any

  return { listener, data, msg }
}

describe('TicketCreatedListener', () => {
  it('creates and saves a ticket', async () => {
    const { listener, data, msg } = setup()
    await listener.onMessage(data, msg)
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeTruthy()
    expect(ticket?.title).toBe(data.title)
    expect(ticket?.price).toBe(data.price)
  })

  it('acknowledges the message', async () => {
    const { listener, data, msg } = setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
  })
})
