import { Router, Request, Response } from 'express'

export const deleteRouter = Router()

deleteRouter.delete('/api/orders/:id', async (_request: Request, response: Response) => {
  return response.status(204).send()
})
