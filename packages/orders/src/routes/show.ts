import { Router, Request, Response } from 'express'
import { NotAuthorizedError, NotFoundError, requestAuth } from '@dc-tickets/common'

import { Order } from '../models/order'

export const showRouter = Router()

showRouter.get('/api/orders/:id', requestAuth, async (request: Request, response: Response) => {
  const { id } = request.params
  const order = await Order.findById(id).populate('ticket')

  if (!order) {
    throw new NotFoundError()
  } else if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  return response.json(order)
})
