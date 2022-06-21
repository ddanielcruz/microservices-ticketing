import { Router } from 'express'

import { currentUser } from '../middleware/current-user'

export const currentUserRouter = Router()

currentUserRouter.get('/api/users/current-user', currentUser, (request, response) => {
  return response.json({ currentUser: request.currentUser || null })
})
