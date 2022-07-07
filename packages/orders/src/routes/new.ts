import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, NotFoundError, requestAuth, validateRequest } from '@dc-tickets/common'
import mongoose from 'mongoose'

import { Ticket } from '../models/ticket'
import { Order, OrderStatus } from '../models/order'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

export const newRouter = Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

newRouter.post(
  '/api/orders',
  requestAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be provided!')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { ticketId } = request.body
    const ticket = await Ticket.findById(ticketId)

    // Find the ticket the user is trying to order in the database
    if (!ticket) {
      throw new NotFoundError()
    }

    // Make sure this ticket is not already reserved
    if (await ticket.isReserved()) {
      throw new BadRequestError('Ticket is already reserved.')
    }

    // Calculate expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build order and save it to the database
    const order = Order.build({
      userId: request.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save()

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    return response.status(201).json(order)
  }
)
