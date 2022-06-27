import { NotFoundError } from '@dc-tickets/common'
import { Router, Request, Response } from 'express'

import { Ticket } from '../models/ticket'

export const showRouter = Router()

showRouter.get('/api/tickets/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const ticket = await Ticket.findById(id)

  if (!ticket) {
    throw new NotFoundError()
  }

  return response.json(ticket)
})
