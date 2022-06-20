import { Request, Response, Router } from 'express'
import { body, validationResult } from 'express-validator'

import { BadRequestError } from '../errors/bad-request-error'
import { RequestValidationError } from '../errors/request-validation-error'
import { User } from '../models/user'

export const signUpRouter = Router()

signUpRouter.post(
  '/api/users/sign-up',
  [
    body('email').trim().toLowerCase().isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 40 })
      .withMessage('Password must be between 4 and 20 characters.')
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = request.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email is already in use.')
    }

    const user = User.build({ email, password })
    await user.save()

    return response.status(201).json(user.toJSON())
  }
)
