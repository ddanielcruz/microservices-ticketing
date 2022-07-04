import { Router, Request, Response } from 'express'

export const indexRouter = Router()

indexRouter.get('/api/orders', async (_request: Request, response: Response) => {
  return response.status(204).send()
})
