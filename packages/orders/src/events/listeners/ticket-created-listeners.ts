import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketCreatedEvent } from '@dc-tickets/common'

import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  readonly queueGroupName = queueGroupName

  async onMessage({ id, title, price }: TicketCreatedEvent['data'], msg: Message) {
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()
    msg.ack()
  }
}
