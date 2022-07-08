import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

import { Order, OrderStatus } from './order'

interface ITicketAttr {
  id: string
  title: string
  price: number
}

export interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attr: ITicketAttr): ITicketDoc
  findByEvent(event: { id: string; version: number }): Promise<ITicketDoc | null>
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

schema.set('versionKey', 'version')
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = ({ id, ...attr }: ITicketAttr) => new Ticket({ ...attr, _id: id })

schema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

schema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this._id,
    status: { $ne: OrderStatus.Cancelled }
  })

  return !!existingOrder
}

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', schema)
