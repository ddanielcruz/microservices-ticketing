import request from 'supertest'

import { app } from '../../app'

describe('Current User', () => {
  it('responds with details about current user', async () => {
    const authResponse = await request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(201)
    const cookie = authResponse.get('Set-Cookie')
    const response = await request(app)
      .get('/api/users/current-user')
      .set('Cookie', cookie)
      .send()
      .expect(200)
    expect(response.body.currentUser).toBeDefined()
  })
})
