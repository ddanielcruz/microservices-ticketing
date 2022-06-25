import { Router } from 'express'
import { currentUser } from '@dc-tickets/common'

export const currentUserRouter = Router()

currentUserRouter.get('/api/users/current-user', currentUser, (request, response) => {
  return response.json({ currentUser: request.currentUser || null })
})
