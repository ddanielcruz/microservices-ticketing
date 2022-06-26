import mongoose from 'mongoose'

interface ITicketAttr {
  title: string
  price: number
  userId: string
}

interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
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
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      versionKey: false
    }
  }
)

schema.statics.build = (attr: ITicketAttr) => new Ticket(attr)

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', schema)
