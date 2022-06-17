import { Router } from 'express'

export const signOutRouter = Router()

signOutRouter.post('/api/users/sign-out', (_, response) => {
  return response.status(204).send()
})
