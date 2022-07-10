import { OrderCreatedEvent, OrderStatus } from '@dc-tickets/common'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = await Ticket.build({ title: 'any-title', price: 10, userId: 'any-id' }).save()

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'any-user-id',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket._id.toHexString(),
      price: 10
    }
  }
  const msg: Message = { ack: jest.fn() } as any

  return { listener, data, msg, ticket }
}

describe('OrderCreatedListener', () => {
  it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket?.orderId).toEqual(data.id)
  })

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
  })

  it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(ticketUpdatedData.orderId).toEqual(data.id)
  })
})
