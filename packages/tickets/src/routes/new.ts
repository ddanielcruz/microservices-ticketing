import { Request, Response, Router } from 'express'
import { requestAuth, validateRequest } from '@dc-tickets/common'
import { body } from 'express-validator'

import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

export const newRouter = Router()

newRouter.post(
  '/api/tickets',
  requestAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero.')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { title, price } = request.body
    const ticket = Ticket.build({
      title,
      price: parseFloat(price),
      userId: request.currentUser!.id
    })

    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish(ticket.toJSON())

    return response.status(201).json(ticket)
  }
)
