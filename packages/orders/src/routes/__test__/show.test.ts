import request from 'supertest'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({ title: `ticket-${Date.now()}`, price: 10 })
  await ticket.save()

  return ticket
}

describe('Show', () => {
  it('fetches the order', async () => {
    const ticket = await buildTicket()
    const userSession = global.signIn()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', userSession)
      .send({ ticketId: ticket.id })
      .expect(201)

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', userSession)
      .send()
      .expect(200)
    expect(response.body.id).toEqual(order.id)
  })

  it('returns an error if user does not own the order', async () => {
    const ticket = await buildTicket()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn('user-1'))
      .send({ ticketId: ticket.id })
      .expect(201)

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signIn('user-2'))
      .send()
      .expect(401)
  })
})
