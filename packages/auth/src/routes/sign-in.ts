import { Router } from 'express'

export const signInRouter = Router()

signInRouter.post('/api/users/sign-in', (_, response) => {
  return response.status(204).send()
})
