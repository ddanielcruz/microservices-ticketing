import request from 'supertest'

import { app } from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({ title: 'any-title', price: 10 })
}

describe('Index', () => {
  it('can fetch a list of tickets', async () => {
    await createTicket()
    const response = await request(app).get('/api/tickets').send()
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toMatchObject({ title: 'any-title', price: 10 })
  })
})
