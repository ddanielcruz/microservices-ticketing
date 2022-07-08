import { TicketUpdatedEvent } from '@dc-tickets/common'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedListener } from '../ticket-updated-listeners'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)
  const ticket = await Ticket.build({
    id: new Types.ObjectId().toHexString(),
    price: 10,
    title: 'any-title'
  }).save()
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: 1,
    price: 20,
    title: 'other-title',
    userId: new Types.ObjectId().toHexString()
  }
  const msg: Message = { ack: jest.fn() } as any

  return { listener, data, msg }
}

describe('TicketUpdateListener', () => {
  it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeTruthy()
    expect(ticket?.title).toBe(data.title)
    expect(ticket?.price).toBe(data.price)
    expect(ticket?.version).toBe(1)
  })

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
  })

  it('does not ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup()
    await expect(listener.onMessage({ ...data, version: 10 }, msg)).rejects.toThrow()
    expect(msg.ack).not.toHaveBeenCalled()
  })
})
