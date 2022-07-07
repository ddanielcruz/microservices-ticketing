import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: `ticket-${Date.now()}`,
    price: 10
  })
  await ticket.save()

  return ticket
}

describe('New', () => {
  it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId })
      .expect(404)
  })

  it.each([OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete])(
    'returns an error if the ticket is already reserved: %s',
    async (status: OrderStatus) => {
      const ticket = await buildTicket()

      const order = Order.build({
        ticket,
        userId: 'any-id',
        status,
        expiresAt: new Date()
      })
      await order.save()

      await request(app)
        .post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ ticketId: ticket._id })
        .expect(400)
    }
  )

  it('reserves a ticket', async () => {
    const ticket = await buildTicket()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket._id })
      .expect(201)
  })

  it('emits an order created event', async () => {
    const ticket = await buildTicket()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket._id })
      .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
