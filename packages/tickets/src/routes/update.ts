import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  requestAuth,
  BadRequestError
} from '@dc-tickets/common'

import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

export const updateRouter = Router()

updateRouter.put(
  '/api/tickets/:id',
  requestAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero.')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved.')
    }

    if (ticket.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({ title: request.body.title, price: parseFloat(request.body.price) })
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish(ticket.toJSON())

    return response.send()
  }
)
