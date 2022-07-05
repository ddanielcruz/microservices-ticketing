import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'

jest.mock('../nats-wrapper')

declare global {
  var signIn: (id?: string) => string[]
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'any-key'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signIn = (id = 'any-id') => {
  const payload = { id, email: 'any@email.com' }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const cookie = Buffer.from(JSON.stringify(session)).toString('base64')

  return [`session=${cookie}`]
}
