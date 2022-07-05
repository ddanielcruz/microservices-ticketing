import mongoose from 'mongoose'
import { OrderStatus } from '@dc-tickets/common'

import { ITicketDoc } from './ticket'

interface IOrderAttr {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: ITicketDoc | string
}

interface IOrderDoc extends mongoose.Document, IOrderAttr {}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attr: IOrderAttr): IOrderDoc
}

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
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

schema.statics.build = (attr: IOrderAttr) => new Order(attr)

export const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', schema)
export { OrderStatus }
