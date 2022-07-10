import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface ITicketAttr {
  title: string
  price: number
  userId: string
}

interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attr: ITicketAttr): ITicketDoc
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

schema.set('versionKey', 'version')
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = (attr: ITicketAttr) => new Ticket(attr)

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', schema)
