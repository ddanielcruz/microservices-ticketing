import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const payload = { title: 'any-title', price: 10 }

describe('Update', () => {
  it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signIn())
      .send(payload)
      .expect(404)
  })

  it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).put(`/api/tickets/${id}`).send(payload).expect(401)
  })

  it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'other-title', price: 20 })
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signIn('other-id'))
      .send(payload)
      .expect(401)
  })

  it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signIn()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send(payload)
    const { id } = response.body
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ price: 10 })
      .expect(400)
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'any-title' })
      .expect(400)
  })

  it('updates the ticket provided valid input', async () => {
    const cookie = global.signIn()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send(payload)
    const { id } = response.body
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'other-title', price: 20 })
      .expect(200)
    const ticket = await Ticket.findById(id)
    expect(ticket).toMatchObject({ title: 'other-title', price: 20 })
  })

  it('publishes an event', async () => {
    const cookie = global.signIn()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send(payload)
    const { id } = response.body
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'other-title', price: 20 })
      .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })

  it('returns a 400 if the ticket is reserved', async () => {
    const { body: ticket } = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'any-title', price: 20 })
    const orderId = new mongoose.Types.ObjectId().toHexString()
    await Ticket.findByIdAndUpdate(ticket.id, { orderId })
    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', global.signIn())
      .send({ title: 'any-title', price: 10 })
      .expect(400)
  })
})
