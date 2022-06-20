import { CustomError } from './custom-error'

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }]
  }
}
