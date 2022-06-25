import { NextFunction, Request, Response } from 'express'

import { NotAuthorizedError } from '../errors/not-authorized-error'

export const requestAuth = (request: Request, _response: Response, next: NextFunction) => {
  if (!request.currentUser) {
    throw new NotAuthorizedError()
  }

  next()
}
