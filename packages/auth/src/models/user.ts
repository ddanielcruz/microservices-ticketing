import mongoose from 'mongoose'

import { Password } from '../services/password'

interface IUserAttr {
  email: string
  password: string
}

interface IUserDoc extends mongoose.Document {
  email: string
  password: string
}

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attr: IUserAttr): IUserDoc
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret.password
        delete ret._id
      },
      versionKey: false
    }
  }
)

schema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'))
    this.set('password', hashedPassword)
  }

  done()
})

schema.statics.build = (attr: IUserAttr) => new User(attr)

export const User = mongoose.model<IUserDoc, IUserModel>('User', schema)
