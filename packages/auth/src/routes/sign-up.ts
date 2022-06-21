import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middleware/validate-request'
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
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email is already in use.')
    }

    const user = User.build({ email, password })
    await user.save()

    // Create user session
    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)
    request.session = { jwt: userJwt }

    return response.status(201).json(user.toJSON())
  }
)
