import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors/custom-error'

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return response.status(error.statusCode).json({ errors: error.serializeErrors() })
  }

  return response.status(500).send({ errors: [{ message: error.message }] })
}
