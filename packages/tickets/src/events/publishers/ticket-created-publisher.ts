import { Publisher, Subjects, TicketCreatedEvent } from '@dc-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
