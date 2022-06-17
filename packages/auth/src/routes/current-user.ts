import { Router } from 'express'

export const currentUserRouter = Router()

currentUserRouter.get('/api/users/current-user', (_, response) => {
  return response.status(204).send()
})
