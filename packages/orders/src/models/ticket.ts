import mongoose from 'mongoose'

import { Order, OrderStatus } from './order'

interface ITicketAttr {
  title: string
  price: number
}

export interface ITicketDoc extends mongoose.Document, ITicketAttr {
  isReserved(): Promise<boolean>
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
      required: true,
      min: 0
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

schema.statics.build = (attr: ITicketAttr) => new Ticket(attr)
schema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this._id,
    status: { $ne: OrderStatus.Cancelled }
  })

  return !!existingOrder
}

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', schema)
