import { Router, Request, Response } from 'express'

import { NotAuthorizedError, NotFoundError, requestAuth } from '@dc-tickets/common'

import { Order, OrderStatus } from '../models/order'
import { natsWrapper } from '../nats-wrapper'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

export const deleteRouter = Router()

deleteRouter.delete(
  '/api/orders/:id',
  requestAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params
    const order = await Order.findById(id)

    if (!order) {
      throw new NotFoundError()
    } else if (order.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket as string
      }
    })

    return response.status(204).send()
  }
)
