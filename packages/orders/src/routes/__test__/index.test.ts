import { Types } from 'mongoose'
import request from 'supertest'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: `ticket-${Date.now()}`,
    price: 10
  })
  await ticket.save()

  return ticket
}

describe('Index', () => {
  it('fetches for an particular user', async () => {
    const [ticketOne, ticketTwo, ticketThree] = await Promise.all([
      buildTicket(),
      buildTicket(),
      buildTicket()
    ])
    const userOne = global.signIn('user-1')
    const userTwo = global.signIn('user-2')

    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne._id })
      .expect(201)
    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo._id })
      .expect(201)

    const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200)
    expect(response.body.length).toEqual(1)
    expect(response.body[0].id).toEqual(orderTwo.id)
    expect(response.body[0].ticket.id).toEqual(ticketTwo._id.toHexString())
  })
})
