import { ValidationError } from 'express-validator'

import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
  constructor(public readonly errors: ValidationError[]) {
    super('Invalid request parameters.', 400)
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map(err => ({ message: err.msg, field: err.param }))
  }
}
