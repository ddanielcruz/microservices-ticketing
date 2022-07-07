import request from 'supertest'

import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({ title: `ticket-${Date.now()}`, price: 10 })
  await ticket.save()

  return ticket
}

describe('Delete', () => {
  it('marks an order as cancelled', async () => {
    const ticket = await buildTicket()
    const userSession = global.signIn()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', userSession)
      .send({ ticketId: ticket.id })
      .expect(201)

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', userSession)
      .send()
      .expect(204)

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
  })

  it('emits an order cancelled event', async () => {
    const ticket = await buildTicket()
    const userSession = global.signIn()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', userSession)
      .send({ ticketId: ticket.id })
      .expect(201)

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', userSession)
      .send()
      .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)
  })
})
