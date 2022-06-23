import request from 'supertest'

import { app } from '../../app'

describe('Sign Up', () => {
  it('returns a 201 on successful sign up', () => {
    return request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
      .expect(201)
  })

  it('returns a 400 with an invalid email', () => {
    return request(app)
      .post('/api/users/sign-up')
      .send({ email: 'invalid-email', password: 'any-password' })
      .expect(400)
  })

  it('returns a 400 with an invalid password', () => {
    return request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any' })
      .expect(400)
  })

  it('returns a 400 with missing email and password', async () => {
    await request(app).post('/api/users/sign-up').send({ email: 'any@email.com' }).expect(400)
    await request(app).post('/api/users/sign-up').send({ password: 'any-password' }).expect(400)
  })

  it('disallows duplicate emails', async () => {
    const payload = { email: 'any@email.com', password: 'any-password' }
    await request(app).post('/api/users/sign-up').send(payload).expect(201)
    await request(app).post('/api/users/sign-up').send(payload).expect(400)
  })

  it('sets a cookie after successful sign up', async () => {
    const response = await request(app)
      .post('/api/users/sign-up')
      .send({ email: 'any@email.com', password: 'any-password' })
    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
