import { Router, Request, Response } from 'express'
import { requestAuth } from '@dc-tickets/common'

import { Order } from '../models/order'

export const indexRouter = Router()

indexRouter.get('/api/orders', requestAuth, async (request: Request, response: Response) => {
  const orders = await Order.find({ userId: request.currentUser!.id }).populate('ticket')
  return response.json(orders)
})
