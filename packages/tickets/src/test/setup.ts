import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'

declare global {
  var signIn: () => string[]
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'any-key'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signIn = () => {
  const payload = { id: 'any-id', email: 'any@email.com' }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const cookie = Buffer.from(JSON.stringify(session)).toString('base64')

  return [`session=${cookie}`]
}
