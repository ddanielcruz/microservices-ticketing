import { Router, Request, Response } from 'express'
import { requestAuth } from '@dc-tickets/common'

export const showRouter = Router()

showRouter.get('/api/orders/:id', requestAuth, async (_request: Request, response: Response) => {
  return response.status(204).send()
})
