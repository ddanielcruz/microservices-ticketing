import { Router, Request, Response } from 'express'

export const newRouter = Router()

newRouter.post('/api/orders', async (_request: Request, response: Response) => {
  return response.status(204).send()
})
