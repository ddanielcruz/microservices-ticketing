import { Request, Response, Router } from 'express'
import { requestAuth, validateRequest } from '@dc-tickets/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'

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

    return response.status(201).json(ticket)
  }
)
