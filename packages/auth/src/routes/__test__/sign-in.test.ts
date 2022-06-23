import request from 'supertest'

import { app } from '../../app'

describe('Sign In', () => {
  it('fails when an email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/sign-in')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(400)
  })

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(201)

    await request(app)
      .post('/api/users/sign-in')
      .send({ email: 'any@email.com', password: 'invalid-password' })
      .expect(400)
  })

  it('response with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(201)

    const response = await request(app)
      .post('/api/users/sign-in')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(204)

    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
