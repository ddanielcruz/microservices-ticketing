import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middleware/validate-request'
import { User } from '../models/user'
import { Password } from '../services/password'

export const signInRouter = Router()

signInRouter.post(
  '/api/users/sign-in',
  [
    body('email').trim().toLowerCase().isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new BadRequestError('Invalid credentials!')
    }

    const passwordsMatch = await Password.compare(user.password, password)
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials!')
    }

    // Create user session
    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)
    request.session = { jwt: userJwt }

    return response.status(204).send()
  }
)
