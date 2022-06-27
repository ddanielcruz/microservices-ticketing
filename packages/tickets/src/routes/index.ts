import { Router, Request, Response } from 'express'

import { Ticket } from '../models/ticket'

export const indexRouter = Router()

indexRouter.get('/api/tickets', async (_request: Request, response: Response) => {
  const tickets = await Ticket.find({})
  return response.json(tickets)
})
