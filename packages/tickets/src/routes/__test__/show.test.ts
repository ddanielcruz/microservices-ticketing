import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'

describe('Show', () => {
  it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/tickets/${id}`).send().expect(404)
  })

  it('returns the ticket if the ticket is found', async () => {
    const title = 'any-title'
    const price = 10

    const {
      body: { id }
    } = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title, price })
      .expect(201)

    const response = await request(app).get(`/api/tickets/${id}`).send().expect(200)
    expect(response.body).toMatchObject({ id, title, price })
  })
})
