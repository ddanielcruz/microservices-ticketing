import request from 'supertest'

import { app } from '../../app'

describe('Sign Out', () => {
  it('clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(201)

    const response = await request(app).post('/api/users/sign-out').send({}).expect(204)
    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
