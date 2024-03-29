import { Listener, OrderCreatedEvent, Subjects } from '@dc-tickets/common'
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../models/ticket'
import { TicketCreatedPublisher } from '../publishers/ticket-created-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket not found.')
    }

    ticket.set({ orderId: data.id })
    await ticket.save()
    await new TicketCreatedPublisher(this.client).publish(ticket.toJSON())

    msg.ack()
  }
}
