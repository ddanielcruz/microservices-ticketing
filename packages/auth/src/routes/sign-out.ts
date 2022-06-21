import { Router } from 'express'

export const signOutRouter = Router()

signOutRouter.post('/api/users/sign-out', (request, response) => {
  request.session = null
  return response.status(204).send()
})
