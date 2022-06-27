import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { NotFoundError, NotAuthorizedError, validateRequest, requestAuth } from '@dc-tickets/common'

import { Ticket } from '../models/ticket'

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

    if (ticket.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({ title: request.body.title, price: parseFloat(request.body.price) })
    await ticket.save()

    return response.send()
  }
)
