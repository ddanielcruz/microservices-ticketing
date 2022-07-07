import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketUpdatedEvent } from '@dc-tickets/common'

import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  readonly queueGroupName = queueGroupName

  async onMessage({ id, title, price, version }: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findOne({ _id: id, version: version - 1 })
    if (!ticket) {
      throw new Error('Ticket not found.')
    }

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
