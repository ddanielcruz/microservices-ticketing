import { Request, Response, Router } from 'express'
import { body, validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/request-validation-error'

export const signUpRouter = Router()

signUpRouter.post(
  '/api/users/sign-up',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 40 })
      .withMessage('Password must be between 4 and 20 characters.')
  ],
  (request: Request, response: Response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    return response.status(204).send()
  }
)
