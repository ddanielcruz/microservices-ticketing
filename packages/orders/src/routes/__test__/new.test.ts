import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

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
      const ticket = Ticket.build({ title: 'any-title', price: 10 })
      await ticket.save()

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
    const ticket = Ticket.build({ title: 'any-title', price: 10 })
    await ticket.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket._id })
      .expect(201)
  })

  it.todo('emits an order created event')
})
