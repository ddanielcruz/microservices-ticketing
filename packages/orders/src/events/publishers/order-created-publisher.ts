import { Publisher, OrderCreatedEvent, Subjects } from '@dc-tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
