import { Publisher, Subjects, TicketUpdatedEvent } from '@dc-tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
