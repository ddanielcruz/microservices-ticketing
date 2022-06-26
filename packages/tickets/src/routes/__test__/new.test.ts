import request from 'supertest'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'

describe('New', () => {
  const route = '/api/tickets'

  it('has a route handler listening to /api/tickets for POST requests', async () => {
    const response = await request(app).post(route).send({})
    expect(response.status).not.toEqual(404)
  })

  it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post(route).send({})
    expect(response.status).toEqual(401)
  })

  it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app).post(route).set('Cookie', global.signIn()).send({})
    expect(response.status).not.toEqual(401)
  })

  it('returns an error if an invalid title is provided', async () => {
    for (const title of ['', undefined]) {
      await request(app)
        .post(route)
        .set('Cookie', global.signIn())
        .send({ title, price: 10 })
        .expect(400)
    }
  })

  it('returns an error if an invalid price is provided', async () => {
    for (const price of [-10, undefined]) {
      await request(app)
        .post(route)
        .set('Cookie', global.signIn())
        .send({ title: 'any-title', price })
        .expect(400)
    }
  })

  it('creates a ticket with valid parameters', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'any-title', price: 10 })
      .expect(201)
    const tickets = await Ticket.find()
    expect(tickets.length).toBe(1)
    expect(tickets[0]).toMatchObject({
      title: 'any-title',
      price: 10,
      userId: 'any-id'
    })
  })
})
